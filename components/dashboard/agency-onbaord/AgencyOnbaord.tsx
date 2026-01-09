"use client";

import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Info } from "lucide-react";
import { buildOrgUrl } from "@/lib/utils/org-urls";
import { OnboardingState, OnboardingStep as StepType } from "./types";
import Link from "next/link";

interface AgencyOnboardProps {
  state: OnboardingState;
}

export default function AgencyOnboard({ state }: AgencyOnboardProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const [expandedSteps, setExpandedSteps] = useState<string[]>([]);

  // Calculate completion
  const requiredSteps = [
    state.agencyAppCreated,
    state.platformCredentialsVerified,
    state.firstClientConnected,
  ];
  const completedSteps = requiredSteps.filter(Boolean).length;
  const totalRequired = requiredSteps.length;
  const progress = (completedSteps / totalRequired) * 100;
  const isSetupComplete = state.AllCompleted;

  // Define steps
  const steps: StepType[] = [
    {
      id: "agency-app",
      title: "Create your agency app",
      description:
        "Your agency app represents your organization inside Palactix and is used to manage platform connections securely.",
      status: state.agencyAppCreated ? "completed" : "not-started",
      actionLabel: "Create agency app",
      actionHref: buildOrgUrl("/agency-app"),
      secondaryText:
        "This app is internal to Palactix and required to manage credentials and clients.",
      isRequired: true,
    },
    {
      id: "platform-credentials",
      title: "Add platform app credentials",
      description:
        "Add your own app credentials for the social platforms you want to use (e.g. Instagram, LinkedIn, X, YouTube).",
      status: state.platformCredentialsVerified
        ? "completed"
        : state.platformCredentialsAdded
        ? "failed"
        : "not-started",
      actionLabel: state.platformCredentialsAdded ? "Verify platform credentials" : "Add platform credentials",
      actionHref: buildOrgUrl("/agency-app"),
      secondaryText:
        "Credentials are verified automatically with each platform. Palactix does not share or reuse credentials across agencies.",
      isRequired: true,
    },
    {
      id: "first-client",
      title: "Connect your first client",
      description:
        "Authorize a client account using your platform app credentials. This allows Palactix to publish content on the client's behalf.",
      status: state.firstClientConnected
        ? "completed"
        : !state.platformCredentialsVerified
        ? "blocked"
        : "not-started",
      actionLabel: "Connect first client",
      actionHref: buildOrgUrl("/clients/create"),
      notice:
        "⚠️ Your 14-day evaluation starts only after your first client is connected.",
      isRequired: true,
      blockingStep: "platform-credentials",
    },
    {
      id: "team-members",
      title: "Invite staff",
      description:
        "Add staff members to help manage client accounts and scheduling.",
      status: state.teamMembersInvited ? "completed" : "not-started",
      actionLabel: "Invite staff",
      actionHref: buildOrgUrl("/staff"),
      secondaryText: "You can invite team members at any time.",
      isRequired: false,
    },
  ];

  // Don't show if dismissed and complete
  if (isDismissed && isSetupComplete) {
    return null;
  }

  // Toggle step expansion
  const toggleStep = (stepId: string) => {
    setExpandedSteps((prev) =>
      prev.includes(stepId)
        ? prev.filter((id) => id !== stepId)
        : [...prev, stepId]
    );
  };

  // Show completion state if all required steps are done
  if (isSetupComplete) {
    return (
      <div className="relative rounded-xl border-2 border-green-200 dark:border-green-900/50 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20 p-6 shadow-lg shadow-green-200/50 dark:shadow-green-900/20 mb-6">
        <div className="relative z-10 flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
            <span className="text-lg">🎉</span>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-green-900 dark:text-green-100 mb-1">
              Your evaluation has started
            </h2>
            <p className="text-sm text-green-800 dark:text-green-200">
              You now have full access to Palactix. Evaluation ends in{" "}
              <strong>{state.evaluationDaysRemaining || 14} days</strong>.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-xl border-2 border-primary/50 bg-gradient-to-r from-primary/5 via-primary/3 to-transparent p-6 shadow-lg shadow-primary/10 mb-6">
      {/* Glowing background effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/10 to-transparent opacity-50 pointer-events-none" />

      <div className="relative z-10">
        {/* Compact Header */}
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-lg font-bold mb-1">
              Complete setup to start your 14-day evaluation
            </h2>
            <p className="text-sm text-muted-foreground">
              Palactix requires your own platform credentials to publish on behalf of clients.
            </p>
          </div>

          {/* Progress Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 flex-shrink-0 whitespace-nowrap">
            <span className="text-xs font-semibold text-primary">
              {completedSteps}/{totalRequired}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <Progress value={progress} className="h-1.5 mb-4" />

        {/* Steps - Vertical Stack */}
        <div className="space-y-2">
          {steps.map((step, index) => {
            const isExpanded = expandedSteps.includes(step.id) || step.status !== "completed";
            const isRequired = step.isRequired;

            return (
              <div
                key={step.id}
                className={`flex items-start justify-between gap-4 p-4 rounded-lg border transition-all ${
                  step.status === "completed"
                    ? "bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-900/50"
                    : step.status === "blocked"
                    ? "bg-orange-100/60 dark:bg-orange-950/40 border-orange-300 dark:border-orange-800"
                    : "bg-muted/30 border-border"
                }`}
              >
                {/* Left Side - Step Content */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="shrink-0 w-7 h-7 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mt-0.5">
                    <span className="text-xs font-bold text-primary">{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold leading-tight">{step.title}</h3>
                      {step.secondaryText && (
                        <div className="relative group">
                          <Info className="w-3.5 h-3.5 text-muted-foreground/70 cursor-help" />
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 dark:bg-gray-800 text-white text-xs rounded px-3 py-2 whitespace-normal w-64 z-10">
                            {step.secondaryText}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-gray-900 dark:bg-gray-800 transform rotate-45"></div>
                          </div>
                        </div>
                      )}
                      <div className={`px-2 py-0.5 rounded text-xs font-medium ${
                        isRequired
                          ? "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
                      }`}>
                        {isRequired ? "Required" : "Optional"}
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && step.status !== "completed" && (
                      <>
                        <p className="text-xs text-muted-foreground mt-2">
                          {step.description}
                        </p>
                        {step.status === "failed" && (
                          <p className="text-xs text-muted-foreground mt-2 font-medium">
                            ⚠️ Verification failed
                          </p>
                        )}
                      </>
                    )}

                    {/* Collapsed State - Show Only Title */}
                    {!isExpanded && step.status === "completed" && (
                      <p className="text-xs text-green-700 dark:text-green-300 mt-1 font-medium">
                        ✓ Completed
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Side - Action Button */}
                <Link
                  href={step.status === "completed" || step.status === "blocked" ? "#" : step.actionHref}
                  onClick={(e) => {
                    if (step.status === "completed" || step.status === "blocked") {
                      e.preventDefault();
                    }
                  }}
                  className={`px-4 py-2 rounded-md text-xs font-medium whitespace-nowrap transition-colors flex-shrink-0 mt-0.5 ${
                    step.status === "completed"
                      ? "bg-green-600 text-white cursor-default"
                      : step.status === "blocked"
                      ? "bg-orange-500 text-white cursor-not-allowed"
                      : "bg-primary text-white hover:bg-primary/90"
                  }`}
                >
                  {step.status === "completed"
                    ? "Done"
                    : step.status === "blocked"
                    ? "Blocked"
                    : step.actionLabel}
                </Link>
              </div>
            );
          })}
        </div>

        {/* Quick Info */}
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground px-1">
          <Info className="w-3.5 h-3.5 flex-shrink-0" />
          <span>
            Evaluation starts after your first client is connected.
          </span>
        </div>
      </div>
    </div>
  );
}