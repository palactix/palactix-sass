export type StepStatus = "not-started" | "in-progress" | "completed" | "blocked" | "failed";

export type OnboardingStep = {
  id: string;
  title: string;
  description: string;
  status: StepStatus;
  actionLabel: string;
  actionHref: string;
  secondaryText?: string;
  notice?: string;
  isRequired: boolean;
  blockingStep?: string; // ID of step that must be completed first
};

export type OnboardingState = {
  agencyAppCreated: boolean;
  platformCredentialsAdded: boolean;
  platformCredentialsVerified: boolean;
  firstClientConnected: boolean;
  evaluationStartDate?: string;
  evaluationDaysRemaining?: number;
  teamMembersInvited: boolean;
  AllCompleted: boolean;
};
