# Palactix Homepage Content Map

This document outlines the content structure and layout representation for the Palactix homepage (`src/app/page.tsx`).

## 1. Navbar
**Representation**: Fixed top bar, transparent with blur effect.
- **Logo**: "Palactix" (Text, Bold)
- **Navigation Links**:
  - Pricing (Anchor link to #pricing)
  - Login (Link to /auth/login)
- **CTA Button**: "Start 14-day Agency Pilot" (Primary Color, Link to /auth/signup)

---

## 2. Hero Section
**Representation**: Split Layout (Left: Copy, Right: Visual Mockup).

### Left Column (Text Content)
- **Trust Badge**: "Zero Platform Bans Since Launch • Used by 1,000+ Accounts" (Pill shape, Primary color accent)
- **H1 Headline**: "Run your own **white-label** social publishing platform"
- **Subheadline**: "Your clients authorize your brand — not a third-party tool. Zero third-party branding. Zero shared keys. Flat pricing."
- **Buttons**:
  - Primary: "Start Agency Pilot" (with Arrow icon)
  - Secondary: "See Pricing" (Ghost variant)
- **Microcopy**: "No credit card required for pilot."

### Right Column (Visual)
- **Mockup**: A simulated OAuth consent screen showing "Johnson Social Agency" (instead of a generic tool) asking for Instagram access.
- **Key Visual Cues**: "JA" logo, Green checkmarks, "Allow Access" button.

---

## 3. Supported Platforms
**Representation**: Full-width strip with a grid of icons.

### Content
- **Headline**: "Native publishing — fully supported today"
- **Platforms**:
  - Instagram (Supported)
  - TikTok (Supported)
  - LinkedIn (Supported)
  - X (Twitter) (Supported)
  - Facebook (Supported)
  - YouTube (Coming Soon)

---

## 4. Pain Point Section
**Representation**: Split Layout (Left: Visual, Right: Copy).

### Left Column (Visual)
- **Mockup**: A "Hootsuite" consent screen asking for access.
- **Visual Overlay**: A large Red "X" and a jagged red circle around the "Hootsuite" name, indicating this is the "bad" experience.

### Right Column (Text Content)
- **Headline**: "Third-party consent screen silently costs six-figure clients"
- **Body Copy**:
  - "When clients see third-party consent screens, trust breaks. Serious brands expect to authorize your app, not someone else’s."
  - "With Palactix, they only see YOUR brand."

---

## 5. Comparison Table
**Representation**: Data Table with checkmarks/crosses.

### Content
- **Headline**: "Why agencies choose Palactix"
- **Competitors**:
  - Hootsuite: Limited white-label, $500–$2000+/mo
  - Sprout Social: Limited white-label, $1000–$3000+/mo
  - Buffer: No white-label, $250–$1200+/mo
  - Sendible: White-label, $700+/mo
  - SocialPilot: White-label, $400+/mo
  - Ayrshare: No white-label, $600+/mo
- **Palactix**: Full white-label, $199–$799 flat

---

## 6. How It Works Section
**Representation**: Step-by-step process.

### Steps
1. **Guided onboarding**: Clear, step-by-step setup for each platform.
2. **Add your own app keys**: Your apps, your permissions, your brand on the consent screen.
3. **Client-authorized access**: Clients approve your app directly, no shared OAuth.
4. **Publish with confidence**: Every action is isolated, auditable, and under your control.

---

## 7. Pricing Section
**Representation**: Pricing cards with features.

### Plans
- **Starter**: $199/mo
  - Up to 5 team seats
  - 50 Clients
  - White-label Dashboard
  - BYO Keys Support
- **Pro**: $799/mo (Most Popular)
  - Everything in Starter
  - Unlimited Clients
  - Unlimited team seats
  - Priority Support
  - Custom Domain
- **Scale**: $1,999+/mo
  - Everything in Pro
  - Dedicated Account Manager
  - SLA
  - Custom Integrations
  - On-premise Option

---

## 8. Honesty Section
**Representation**: Two-column layout (We Nail vs. We Don’t Have Yet).

### We Nail
- White-label scheduling
- True BYO keys
- We never publish through shared social apps
- Unlimited clients flat pricing

### We Don’t Have Yet
- Social listening/inbox
- Advanced comment moderation
- Built-in analytics

---

## 9. FAQ Section
**Representation**: Accordion-style FAQ.

### Questions
1. Why does Palactix require my own app credentials?
   - Because your clients trust you, not us. Using your own apps ensures full isolation, brand-safe OAuth consent, and zero shared access across agencies.
2. Will my clients ever see "Palactix" anywhere?
   - No. Once you add your own keys, your agency's name appears everywhere — in OAuth consent screens, email notifications, and anywhere a brand name would be visible. We're completely invisible to your end clients.
3. When does the 14-day agency pilot start?
   - Once your app credentials are connected. The pilot includes full access with no feature restrictions.
4. Do I have to pay during the 14-day pilot?
   - No credit card required. You get 5 days using our keys to test the platform, then you'll need to add your own keys to continue the trial. The paid plan only starts after your 14-day pilot period ends.
5. What happens on day 6 if I haven't added my own keys yet?
   - Posting stops until you add them. You'll still have full access to the dashboard and setup guides. Once your keys are approved and added, publishing resumes immediately.
6. How long does app approval take on Instagram/Facebook/TikTok?
   - 4–10 days on average. Instagram/Facebook typically takes 3–7 days. TikTok can be 5–10 days. We provide detailed templates and step-by-step guides. Our support team reviews your submissions before you send them to ensure faster approval.
7. Can my team members each have their own login?
   - Yes — up to 5 team seats on Starter plan. Unlimited seats on Pro and Scale plans. Each member gets their own credentials and role-based permissions.
8. My clients are already connected to another tool. How seamless is the migration?
   - Extremely. Generate fresh OAuth link → send to client → they authorize → done. Since you own the keys, there's no data migration needed. Most agencies complete this in under 2 minutes per client.
9. Where are the OAuth tokens stored?
   - Encrypted at rest using AES-256 in isolated database instances. Your keys never touch shared infrastructure. We're SOC 2 Type II compliant (in progress) and follow OAuth 2.0 best practices.
10. If I ever leave Palactix, what happens to my clients and tokens?
    - You own your app keys — nothing is ever locked in. Simply point your apps to a new backend or export the tokens. We provide migration guides and don't hold your data hostage.

---

## 10. Final CTA
**Representation**: Centered call-to-action.

### Content
- **Headline**: "Stop losing clients to third-party consent screens"
- **CTA Button**: "Get started with Palactix"
- **Microcopy**: "We’ll even help you get your apps approved. Cancel anytime."
