import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { schedulePost } from "./scheduler.apis";
import { SchedulePostPayload, SchedulePostResponse } from "../types";

export const schedulerKeys = {
  all: ["scheduler"] as const,
};

interface SchedulePostParams {
  clientId: string;
  payload: SchedulePostPayload;
}

export function useSchedulePostMutation() {
  return useMutation<SchedulePostResponse, Error, SchedulePostParams>({
    mutationFn: ({ clientId, payload }) => schedulePost(clientId, payload),
    onSuccess: (res) => {
      toast.success(res.message);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to publish post");
    },
  });
}
