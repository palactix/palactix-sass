export type Platform = {
  id: string;
  name: string;
  icon: PlatFormIcon;
  slug: string;
  api_url: string;
  version?: string | null;
  supports_refresh: number; // 0 or 1
};

export type LinkedAccount = {
  id: string;
  channel_id: string;
  channel_slug: string;
  external_id: string;
  name: string;
  username: string;
  avatar: string;
  account_type: string;
  status: number;
  has_token: boolean;
  children: LinkedAccount[];
  channel: Platform;
};


export interface PlatFormIcon {
  "logo-black-png"?: string;
  "logo-black-svg"?: string;
  "logo-white-png"?: string;
  "logo-white-svg"?: string;
  "logo-png"?: string;
  "logo-svg"?: string;
}
