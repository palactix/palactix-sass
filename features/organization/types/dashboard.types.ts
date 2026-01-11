export interface DashboardMeta {
  organization_id: number;
  role: string | null;
  generated_at: string;
}

export interface DashboardAlert {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  actionUrl?: string;
}

export interface DashboardAlerts {
  hasUnread: boolean;
  items: DashboardAlert[];
}

export interface DashboardChannels {
  connected: number;
  verified: number;
  connected_accounts: number;
  total_social_accounts: number;
}

export interface DashboardClients {
  used: number;
  limit: number;
  remaining: number;
  reached: boolean;
  pending_invitations: number;
}

export interface DashboardStaff {
  used: number;
  limit: number;
  remaining: number;
  reached: boolean;
  pending_invitations: number;
}

export interface DashboardSchedules {
  total_schedules: number;
  upcoming_schedules: number;
  draft: number;
  needing_attention: number;
}

export interface DashboardData {
  meta: DashboardMeta;
  alerts: DashboardAlerts;
  channels: DashboardChannels;
  clients: DashboardClients;
  staff: DashboardStaff;
  schedules: DashboardSchedules;
}
