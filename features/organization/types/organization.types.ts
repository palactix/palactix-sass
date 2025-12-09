export interface OrganizationPivot {
  user_id: number;
  organization_id: number;
  role_id: number;
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: number;
  name: string;
  slug: string;
  type: string;
  owner_user_id: number;
  address: string | null;
  phone: string | null;
  website: string | null;
  created_at: string;
  updated_at: string;
  pivot: OrganizationPivot;
}

export type OrganizationRole = 'owner' | 'admin' | 'member';

/**
 * Get user's role in an organization based on role_id
 */
export function getOrganizationRole(roleId: number): OrganizationRole {
  // Assuming role_id: 1 = owner, 2 = admin, 3 = member
  // Adjust these mappings based on your backend
  switch (roleId) {
    case 1:
      return 'owner';
    case 2:
      return 'admin';
    case 3:
      return 'member';
    default:
      return 'member';
  }
}
