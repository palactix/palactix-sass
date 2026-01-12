import { OnboardingState } from "@/components/dashboard/agency-onbaord/types";
import { Permission } from "@/utils/constants/permissions";

export interface Role {
  id: number;
  name: string;
  slug: string;
}

export interface Limit {
  max: number | null;
  current: number;
  remaining: number | null;
  reached: boolean;
}

export interface Limits {
  staff: Limit;
  clients: Limit;
  channels: Limit;
  posts_per_month: Limit;
}

export interface Features {
  custom_domain: boolean;
  audit_log: boolean;
  bulk_scheduling: boolean;
  priority_queue: boolean;
  priority_support: boolean;
  dedicated_manager: boolean;
}

export interface Plan {
  name: string;
  slug: string;
  status: string;
  on_trial: boolean;
  trial_ends_at: string | null;
  requires_app_creation: boolean;
  app_creation_deadline: string | null;
  days_until_app_deadline: number | null;
  has_developer_app: boolean;
  current_period_end: Date | null;
}

export interface OrganizationPermissions {
  role: Role;
  permissions: Permission[];
  limits: Limits;
  features: Features;
  plan: Plan;
  onboard: OnboardingState;
}
