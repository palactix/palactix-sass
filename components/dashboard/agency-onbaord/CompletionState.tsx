import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Calendar, ArrowRight } from "lucide-react";
import { buildOrgUrl } from "@/lib/utils/org-urls";

interface CompletionStateProps {
  evaluationDaysRemaining: number;
  onDismiss?: () => void;
}

export function CompletionState({
  evaluationDaysRemaining,
  onDismiss,
}: CompletionStateProps) {
  return (
    <div className="rounded-xl border bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-900/50 p-8">
      <div className="flex items-start gap-4 mb-6">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-600 flex-shrink-0">
          <CheckCircle2 className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-2">🎉 Setup Complete</h2>
          <p className="text-lg text-muted-foreground mb-4">
            Your evaluation has started
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            You now have full access to Palactix.
          </p>

          {/* Evaluation Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900/50">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900 dark:text-blue-200">
              14-day evaluation — {evaluationDaysRemaining} days remaining
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button size="lg" asChild>
          <Link href={buildOrgUrl("/scheduler")}>
            Create a post
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link href={buildOrgUrl("/clients")}>Manage clients</Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link href={buildOrgUrl("/scheduler")}>View scheduler</Link>
        </Button>
      </div>

      {onDismiss && (
        <button
          onClick={onDismiss}
          className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Dismiss this message
        </button>
      )}
    </div>
  );
}
