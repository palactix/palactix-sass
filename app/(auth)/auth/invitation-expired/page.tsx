import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Mail } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invitation Expired - Palactix",
  description:
    "Your invitation link has expired or is no longer valid."
};

export default function InvitationExpirePage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Main Content Card */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">Invitation Link Expired</h1>
          <p className="text-muted-foreground">
            This link is no longer valid
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
          <div className="text-center space-y-6">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center">
                <Clock className="h-8 w-8 text-amber-600" />
              </div>
            </div>

            {/* Message */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">What happened?</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Invitation links are only valid for a limited time for security reasons. 
                Your invitation link has expired or has already been used.
              </p>
            </div>

            {/* Next Steps Card */}
            <Card className="bg-muted/50 border-muted p-4 text-left">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <h4 className="font-medium text-sm">What to do next?</h4>
                  <p className="text-xs text-muted-foreground">
                    Please contact your administrator or agency owner to request a new 
                    invitation link. They will be able to send you a fresh invitation.
                  </p>
                </div>
              </div>
            </Card>

            {/* Action Button */}
            <div className="pt-2">
              <Link href="/auth/login" className="block">
                <Button className="w-full" size="lg">
                  Back to Login
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <p className="text-center mt-6 text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-primary hover:underline font-medium">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}


            