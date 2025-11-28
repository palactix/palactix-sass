"use client";

import { useMutation } from "@tanstack/react-query";
import { signup, resendVerification } from "./auth.api";
import type { SignupPayload, SignupResponse, ResendVerificationPayload, ResendVerificationResponse } from "../types/auth.types";

export function useSignupMutation() {
  return useMutation<SignupResponse, Error, SignupPayload>({
    mutationFn: signup,
  });
}

export function useResendVerificationMutation() {
  return useMutation<ResendVerificationResponse, Error, ResendVerificationPayload>({
    mutationFn: resendVerification,
  });
}
