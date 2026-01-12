"use client";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertTriangle,
  FileText,
  Link2,
  Shield,
  Users,
  Calendar,
  UserPlus,
  CreditCard,
  ChevronDown,
  Settings,
} from "lucide-react";
import AgencyOnboard from "./agency-onbaord/AgencyOnbaord";
import { usePermissionStore } from "@/features/organization/stores/permission.store";
import { useDashboard } from "@/features/organization/hooks/useDashboard";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { StatWidget } from "./widgets/StatWidget";
import { SectionHeader } from "./widgets/SectionHeader";
import { AlertWidget } from "./widgets/AlertWidget";
import { NoticeCard } from "./widgets/NoticeCard";
import Link from "next/link";
import { buildOrgUrl } from "@/lib/utils/org-urls";

export default function AgencyDashboard() {
  const { data: permissions } = usePermissionStore();
  const { data: dashboard, isLoading, error } = useDashboard();

  if (error) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to load dashboard data. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-8 p-4 md:p-8">
      {/* Welcome Section */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground mt-1">
          Operational snapshot for today
        </p>
      </div>

      {/* Agency App Banner */}
      {permissions?.onboard && <AgencyOnboard state={permissions?.onboard} />}

      {/* Publishing Health Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <SectionHeader title="Publishing Health" />
          <Link href={buildOrgUrl("agency-app")}>
            <Button variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              Manage Credentials
            </Button>
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatWidget
            title="Connected Platforms"
            value={dashboard?.channels.connected || 0}
            icon={Link2}
            isLoading={isLoading}
          />
          <StatWidget
            title="Verified Platforms"
            value={dashboard?.channels.verified || 0}
            icon={Shield}
            valueClassName="text-green-600"
            isLoading={isLoading}
          />
          <StatWidget
            title="Connected Clients"
            value={dashboard?.channels.connected_accounts || 0}
            icon={Users}
            isLoading={isLoading}
          />
          <StatWidget
            title="Active Social Accounts"
            value={dashboard?.channels.total_social_accounts || 0}
            icon={Users}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Scheduling Status */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <SectionHeader title="Scheduling Status" />
          <div className="flex gap-2">
            <Button size="sm">Open Scheduler</Button>
            <Button variant="outline" size="sm">
              View Drafts
            </Button>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <StatWidget
            title="Scheduled (next 7 days)"
            value={dashboard?.schedules.upcoming_schedules || 0}
            icon={Calendar}
            isLoading={isLoading}
          />
          <StatWidget
            title="Drafts"
            value={dashboard?.schedules.draft || 0}
            icon={FileText}
            valueClassName="text-amber-600"
            isLoading={isLoading}
          />
          <StatWidget
            title="Needs Attention"
            value={dashboard?.schedules.needing_attention || 0}
            icon={AlertTriangle}
            valueClassName="text-red-600"
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Clients Overview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <SectionHeader title="Clients Overview" />
          <Link href={buildOrgUrl("clients")}>
            <Button variant="outline" size="sm">
              Manage Clients
            </Button>
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <StatWidget
            title="Total Clients"
            value={dashboard?.clients.used || 0}
            icon={Users}
            isLoading={isLoading}
          />
          <StatWidget
            title="Active"
            value={
              dashboard
                ? dashboard.clients.used - dashboard.clients.pending_invitations
                : 0
            }
            icon={Users}
            valueClassName="text-green-600"
            isLoading={isLoading}
          />
          <StatWidget
            title="Pending"
            value={dashboard?.clients.pending_invitations || 0}
            icon={Users}
            valueClassName="text-amber-600"
            isLoading={isLoading}
          />
        </div>
        {!isLoading && dashboard?.clients.reached && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You&apos;ve reached your client limit ({dashboard.clients.limit}).
              Upgrade your plan to add more clients.
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Team Overview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <SectionHeader title="Team Overview" />
          <Link href={buildOrgUrl("staff/create")}>
            <Button size="sm">
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Team Member
            </Button>
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <StatWidget
            title="Team Members"
            value={dashboard?.staff.used || 0}
            icon={Users}
            isLoading={isLoading}
          />
          <StatWidget
            title="Available Seats"
            value={dashboard?.staff.remaining || 0}
            icon={Users}
            valueClassName="text-green-600"
            isLoading={isLoading}
          />
          <StatWidget
            title="Pending Invites"
            value={dashboard?.staff.pending_invitations || 0}
            icon={Users}
            valueClassName="text-amber-600"
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Alerts & Attention Required */}
      {!isLoading && dashboard?.alerts.items && dashboard.alerts.items.length > 0 && (
        <AlertWidget alerts={dashboard.alerts.items} />
      )}

      {/* Subscription & Billing */}
      <Card>
        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Subscription & Billing
              </CardTitle>
              <CardDescription>
                Current Plan: <Badge variant="secondary">{permissions?.plan.name || "No Plan"}</Badge> 
                {permissions?.plan.current_period_end && ` • Next billing: ${permissions.plan.current_period_end}`}
              </CardDescription>
            </div>
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
      </Card>

      {/* Platform Notice */}
      <NoticeCard>
        <strong>Palactix never uses shared platform apps.</strong>
        <br />
        All publishing occurs via your own developer credentials.
      </NoticeCard>
    </div>
  );
}