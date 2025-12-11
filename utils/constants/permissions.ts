export const PERMISSIONS = {
  DEVELOPER_APP: {
    MANAGE: 'developer_app.manage',
  },
  BILLING: {
    MANAGE: 'billing.manage',
  },
  ORGANIZATION: {
    UPDATE: 'organization.update',
  },
  STAFF: {
    INVITE: 'staff.invite',
    VIEW: 'staff.view',
    UPDATE: 'staff.update',
    DELETE: 'staff.delete',
  },
  CLIENTS: {
    INVITE: 'clients.invite',
    VIEW: 'clients.view',
    UPDATE: 'clients.update',
    DELETE: 'clients.delete',
    ASSIGN: 'clients.assign',
  },
  SCHEDULER: {
    MANAGE: 'scheduler.manage',
  },
  ANALYTICS: {
    VIEW: 'analytics.view',
  },
} as const;

// Extract all permission string values from the nested PERMISSIONS object
// Using a distributive approach: for each category K, get all values in PERMISSIONS[K]
export type Permission = {
  [K in keyof typeof PERMISSIONS]: (typeof PERMISSIONS)[K][keyof (typeof PERMISSIONS)[K]]
}[keyof typeof PERMISSIONS];
