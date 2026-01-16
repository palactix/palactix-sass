# Backend Implementation Guide: Paddle Billing Integration

## Overview
We are implementing **Paddle Billing** for subscription management. Use the **Paddle Billing API (v2)**, not the Classic API.

The Frontend handles the checkout initiation and passes critical context via `customData`. The Backend's responsibility is to listen to Paddle Webhooks and provision the resources/access levels accordingly.

## 1. Environment Variables
You will need the following keys from the Paddle Developer Dashboard:

- `PADDLE_WEBHOOK_SECRET_KEY`: Used to verify the signature of incoming webhooks.
- `PADDLE_API_KEY`: (Optional) Required if you need to query the Paddle API directly for sync operations.

## 2. Webhook Endpoint
Create a **POST** endpoint (e.g., `/api/webhooks/paddle`) to receive events.

### Security: Signature Verification
Paddle sends a `Paddle-Signature` header. You **MUST** verify this signature to ensure the request is genuine.
- **Reference**: [Paddle Signature Verification Guide](https://developer.paddle.com/webhook-reference/verifying-webhooks)

## 3. Handling Checkout Data
When the frontend triggers `paddle.Checkout.open()`, we pass the following **Custom Data**:

```json
{
  "customData": {
    "organizationId": "123",    // The ID of the organization upgrading
    "userId": "456",            // The ID of the user performing the action
    "organizationSlug": "acme"  // The slug for reference
  }
}
```

You must extract this from the webhook payload at `data.custom_data`.

## 4. Critical Webhook Events to Handle

### A. `subscription.created`
Fired when a user successfully subscribes.
*   **Action**: Provision the plan.
*   **Logic**:
    1.  Extract `organizationId` from `custom_data`.
    2.  Extract `price_id` (or `product_id`) from `data.items[0].price.id` to determine if it is **Starter**, **Pro**, or **Scale**.
    3.  Update the **Organization** record:
        *   Set `subscription_id` = `data.id`
        *   Set `plan` = (Mapped Plan based on Price ID)
        *   Set `subscription_status` = `data.status` (usually 'active')
        *   Update resource limits (seats, clients, etc.) corresponding to the plan.

### B. `subscription.updated`
Fired when a subscription changes (upgrade/downgrade) or payment renews.
*   **Action**: Sync plan status.
*   **Logic**:
    1.  Check `data.status` (e.g., `active`, `past_due`, `paused`).
    2.  Check if `data.items[0].price.id` has changed (Upgrade/Downgrade).
    3.  Update the database permissions/limits accordingly.

### C. `subscription.canceled` / `subscription.past_due`
Fired when a user cancels or payment fails repeatedly.
*   **Action**: Revoke access / Grace period.
*   **Logic**:
    *   If `canceled`: You might want to let them finish the current billing period (check `data.current_billing_period.ends_at`).
    *   If `past_due`: Notify user or restrict access.

## 5. Plan Mapping Configuration
Ensure your backend config matches the Paddle Dashboard Price IDs.

| Plan Name | Paddle Price ID (Example) | Backend Role/Permission Level |
|TBD|TBD|TBD|
| **Starter** | `pri_starter_...` | Level 1 (5 Seats, 50 Clients) |
| **Pro** | `pri_pro_...` | Level 2 (Unl Seats, Unl Clients) |
| **Scale** | `pri_scale_...` | Level 3 (Enterprise Features) |

## 6. Testing (Sandbox)
1.  Use the **Paddle Sandbox** environment.
2.  Use Paddle's [Test Cards](https://developer.paddle.com/concepts/payment-methods/test-cards) to simulate successful payments.
3.  Use the **Event Simulator** in Paddle Dashboard to fire `subscription.created` events to your `localhost` (using ngrok or similar) to verify your logic.
