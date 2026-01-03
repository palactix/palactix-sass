import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MediaItem } from "@/types/scheduler";
import { SchedulerFormValues, schedulerFormSchema } from "../schema/schema";

export function useSchedulerForm(defaultTimezone: string, maxMedia = 10) {
  const form = useForm<SchedulerFormValues>({
    resolver: zodResolver(schedulerFormSchema),
    defaultValues: {
      media: [],
      selected_accounts: [],
      per_account_captions: {},
      separate_captions: false,
      global_caption: "",
      first_comment: "",
      scheduled_date: "",
      scheduled_time: "",
      timezone: defaultTimezone,
      campaign_id: undefined,
      tag_ids: [],
    },
  });

  const addMedia = useCallback(
    (files: FileList) => {
      const current = form.getValues("media");
      const remaining = Math.max(0, maxMedia - current.length);
      const incoming: MediaItem[] = Array.from(files)
        .slice(0, remaining)
        .map((file, index) => ({
          id: `${Date.now()}-${index}`,
          url: URL.createObjectURL(file),
          type: file.type.startsWith("video") ? "video" : "image",
          altText: "",
        }));
      form.setValue("media", [...current, ...incoming], { shouldDirty: true });
    },
    [form, maxMedia]
  );

  const removeMedia = useCallback(
    (id: string | number) => {
      const next = form.getValues("media").filter((item) => item.id !== id);
      form.setValue("media", next, { shouldDirty: true });
    },
    [form]
  );

  const updateAltText = useCallback(
    (id: string | number, altText: string) => {
      const next = form.getValues("media").map((item) =>
        item.id === id ? { ...item, altText } : item
      );
      form.setValue("media", next, { shouldDirty: true });
    },
    [form]
  );

  const updateAccounts = useCallback(
    (ids: string[]) => {
      const prev = form.getValues("selected_accounts");
      const removed = prev.filter((id) => !ids.includes(id));
      if (removed.length) {
        const captions = { ...form.getValues("per_account_captions") };
        removed.forEach((id) => delete captions[id]);
        form.setValue("per_account_captions", captions, { shouldDirty: true });
      }
      form.setValue("selected_accounts", ids, { shouldDirty: true });
    },
    [form]
  );

  return {
    form,
    addMedia,
    removeMedia,
    updateAltText,
    updateAccounts,
  };
}
