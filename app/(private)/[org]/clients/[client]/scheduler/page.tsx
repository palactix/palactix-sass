"use client";

import { useMemo } from "react";
import { useWatch, useFormContext } from "react-hook-form";
import { Clock, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { CaptionsEditor } from "@/components/scheduler/CaptionsEditor";
import { ChooseAccounts } from "@/components/scheduler/ChooseAccounts";
import { MediaUploader } from "@/components/scheduler/MediaUploader";
import { ScheduleBar } from "@/components/scheduler/ScheduleBar";
import { AccountPreviewRail } from "@/components/scheduler/AccountPreviewRail";
import { CampaignSelector } from "@/components/scheduler/CampaignSelector";
import { TagSelector } from "@/components/scheduler/TagSelector";
import { useUser } from "@/features/auth/api/auth.queries";
import { useLinkedAccounts } from "@/features/clients/api/clients.queries";
import { useSchedulerForm } from "@/features/scheduler/hooks/useSchedulerForm";
import { useSchedulePostMutation } from "@/features/scheduler/api/scheduler.queries";
import { Platform, LinkedAccount } from "@/types/platform";
import { toast } from "sonner";
import { useParams } from "next/navigation";

export default function ClientSchedulerPage() {
  const MAX_MEDIA = 10;
  const params = useParams();
  const clientId = params.client as string;
  const defaultTimezone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone, []);
  const { form, updateAccounts } = useSchedulerForm(defaultTimezone, MAX_MEDIA);
  const schedulePostMutation = useSchedulePostMutation();

  const selectedAccounts = useWatch({ control: form.control, name: "selected_accounts" }) as string[];

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

  const onSubmit = form.handleSubmit(
    (values) => {
      try {
        // Validate at least one account selected
        if (!values.selected_accounts || values.selected_accounts.length === 0) {
          toast.error("Please select at least one account");
          return;
        }

        // Extract media IDs
        const mediaIds = values.media?.map(m => String(m.id)).filter(Boolean) || [];

        // Build channel_posts array
        const channelPosts = values.selected_accounts.map(accountId => {
          // Get caption for this account (global or per-account)
          const caption = values.separate_captions
            ? values.per_account_captions?.[accountId]
            : values.global_caption;

          // Validate: must have either content or media
          const hasContent = caption?.trim();
          const hasMedia = mediaIds.length > 0;

          if (!hasContent && !hasMedia) {
            throw new Error(`Account ${accountId} must have either a caption or media`);
          }

          // Build post object
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const post: Record<string, any> = {
            user_channel_account_id: accountId,
          };

          // Add content if present
          if (hasContent) {
            post.content = caption.trim();
          }

          // Add media_ids if present
          if (hasMedia) {
            post.media_ids = mediaIds;
          }

          // Add optional first_comment (global for all posts)
          if (values.first_comment?.trim()) {
            post.first_comment = values.first_comment.trim();
          }

          // Add scheduling if both date and time present
          if (values.scheduled_date && values.scheduled_time) {
            post.scheduled_at = `${values.scheduled_date}T${values.scheduled_time}:00`;
            post.timezone = values.timezone;
          }

          // Add tag_ids if present (global for all posts)
          if (values.tag_ids && values.tag_ids.length > 0) {
            post.tag_ids = values.tag_ids;
          }

          return post;
        });

        // Build final payload
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const payload: Record<string, any> = {
          channel_posts: channelPosts,
        };

        // Add optional campaign_id
        if (values.campaign_id) {
          payload.campaign_id = values.campaign_id;
        }

        // Call API to schedule/publish post
        schedulePostMutation.mutate({ clientId, payload });

      } catch (error) {
        console.error("Validation error:", error);
        toast.error(error instanceof Error ? error.message : "Failed to create post");
      }
    },
    (errors) => {
      // Handle validation errors from schema
      console.log("Form validation errors:", errors);
      const firstError = Object.values(errors)[0];
      if (firstError?.message) {
        toast.error(String(firstError.message));
      } else {
        toast.error("Please fill in all required fields");
      }
    }
  );

  return (
    <Form {...form}>
      <form id="schedulerForm" name="schedulerForm" onSubmit={onSubmit}>
        <div className="min-h-screen bg-muted/30">
          <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b shadow-sm">
            <div className="container max-w-7xl mx-auto px-6 py-4">
              <Header />
            </div>
          </div>

          <div className="flex gap-6">
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
          </div>
        </div>
      </form>
    </Form>
  );
}

function Header() {
  const { control } = useFormContext();
  const selectedAccounts = useWatch({ control, name: "selected_accounts" }) as string[];

  return (
    <div className="space-y-3">
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block">Campaign</Label>
          <CampaignSelector />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block">Tags</Label>
          <TagSelector />
        </div>
      </div>
    </div>
  );
}

function FirstComment() {
  const { control, setValue } = useFormContext();
  const firstComment = useWatch({ control, name: "first_comment" }) as string;

  return (
    <>
      <Textarea
        placeholder="Add a first comment that will be posted immediately after your post goes live..."
        className="min-h-24 resize-none"
        value={firstComment}
        onChange={(e) => setValue("first_comment", e.target.value, { shouldDirty: true })}
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