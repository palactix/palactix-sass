"use client";

import { useMemo } from "react";
import { useWatch, useFormContext } from "react-hook-form";
import { Clock, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Form } from "@/components/ui/form";
import { CaptionsEditor } from "@/components/scheduler/CaptionsEditor";
import { ChooseAccounts } from "@/components/scheduler/ChooseAccounts";
import { MediaUploader } from "@/components/scheduler/MediaUploader";
import { ScheduleBar } from "@/components/scheduler/ScheduleBar";
import { AccountPreviewRail } from "@/components/scheduler/AccountPreviewRail";
import { useUser } from "@/features/auth/api/auth.queries";
import { useLinkedAccounts } from "@/features/clients/api/clients.queries";
import { useSchedulerForm } from "@/features/scheduler/hooks/useSchedulerForm";
import { Platform, LinkedAccount } from "@/types/platform";

export default function ClientSchedulerPage() {
  const MAX_MEDIA = 10;
  const defaultTimezone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone, []);
  const { form, updateAccounts } = useSchedulerForm(defaultTimezone, MAX_MEDIA);

  const selectedAccounts = useWatch({ control: form.control, name: "selectedAccounts" }) as string[];

  const { data: user } = useUser();
  const { data: linkedData, isLoading: linkedLoading } = useLinkedAccounts(15);

  const linkedAccounts = useMemo(() => linkedData?.linked_accounts ?? [], [linkedData]);
  const channels = useMemo(() => linkedData?.channels ?? [], [linkedData]);

  const channelMap = useMemo(() => {
    const map = new Map<string, Platform>();
    channels.forEach((c) => map.set(String(c.id), c as Platform));
    return map;
  }, [channels]);

  const accountMap = useMemo(() => {
    const map = new Map<string, LinkedAccount>();
    linkedAccounts.forEach((a) => map.set(String(a.id), a as LinkedAccount));
    return map;
  }, [linkedAccounts]);

  const timezoneOptions = useMemo(
    () => [
      "UTC",
      "America/Los_Angeles",
      "America/New_York",
      "Europe/London",
      "Europe/Berlin",
      "Asia/Singapore",
      "Asia/Kolkata",
      defaultTimezone,
    ].filter((v, idx, arr) => arr.indexOf(v) === idx),
    [defaultTimezone]
  );

  const onSubmit = form.handleSubmit((values) => {
    // TODO: wire to API
    console.log("Schedule payload", values);
  });

  return (
    <Form {...form}>
      <div className="min-h-screen bg-muted/30">
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b shadow-sm">
          <div className="container max-w-7xl mx-auto px-6 py-4">
            <Header timezoneOptions={timezoneOptions} />
          </div>
        </div>

        <form id="schedulerForm" name="schedulerForm" onSubmit={onSubmit} className="flex gap-6">
          <div className="flex-1 p-6">
            <div className="container max-w-5xl mx-auto space-y-6">
              <MediaUploader maxItems={MAX_MEDIA} />

              {user && (
                <ChooseAccounts
                  client={user}
                  selectedAccountIds={selectedAccounts}
                  onChange={(ids) => updateAccounts(ids)}
                  linkedAccountsData={linkedData}
                  isLoadingOverride={linkedLoading}
                />
              )}

              <CaptionsEditor accountsMap={accountMap} channelMap={channelMap} />

              <Card className="p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold">First Comment</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Add a first comment to your post (optional)</p>
                  </div>
                </div>
                <FirstComment />
              </Card>
            </div>
          </div>

          <div className="w-20 border-l bg-muted/50 p-3 sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto">
            <AccountPreviewRail accountsMap={accountMap} channelMap={channelMap} />
          </div>
        </form>
      </div>
    </Form>
  );
}

function Header({ timezoneOptions }: { timezoneOptions: string[] }) {
  const { control } = useFormContext();
  const selectedAccounts = useWatch({ control, name: "selectedAccounts" }) as string[];

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold">Create Post</h1>
        {selectedAccounts.length > 0 && (
          <Badge variant="secondary" className="text-xs">
            {selectedAccounts.length} {selectedAccounts.length === 1 ? "account" : "accounts"} selected
          </Badge>
        )}
      </div>

      <ScheduleBar
        timezoneOptions={timezoneOptions}
        rightActions={(
          <>
            <Button type="submit" form="schedulerForm" variant="outline" size="default" className="gap-2">
              <Send className="h-4 w-4" />
              Post Now
            </Button>
            <Button type="submit" form="schedulerForm" size="default" className="gap-2">
              <Clock className="h-4 w-4" />
              Schedule Post
            </Button>
          </>
        )}
      />
    </div>
  );
}

function FirstComment() {
  const { control, setValue } = useFormContext();
  const firstComment = useWatch({ control, name: "firstComment" }) as string;

  return (
    <>
      <Textarea
        placeholder="Add a first comment that will be posted immediately after your post goes live..."
        className="min-h-24 resize-none"
        value={firstComment}
        onChange={(e) => setValue("firstComment", e.target.value, { shouldDirty: true })}
      />
      <div className="flex items-center justify-between mt-2">
        <p className="text-xs text-muted-foreground">{firstComment.length} characters</p>
        <Button variant="ghost" size="sm" className="h-7 text-xs" type="button">
          Add Emoji
        </Button>
      </div>
    </>
  );
}