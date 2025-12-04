import { useMutation } from "@tanstack/react-query";
import { createStaff } from "./staff.api";
import { CreateStaffPayload, CreateStaffResponse } from "../types/staff.types";

export function useCreateStaffMutation() {
  return useMutation<CreateStaffResponse, Error, CreateStaffPayload>({
    mutationFn: createStaff,
  });
}
