import { Channel } from "@/features/agency-app/types/agency-app.types";
import { Organization } from "@/features/organization/types/organization.types";


export interface OnboardInfoResponse {
  organization: Organization;
  channels: Channel[];
}
