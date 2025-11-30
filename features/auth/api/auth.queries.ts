"use client";

import { useMutation } from "@tanstack/react-query";
import { signup, resendVerification, login } from "./auth.api";
import type { 
  SignupPayload, 
  SignupResponse, 
  ResendVerificationPayload, 
  ResendVerificationResponse,
  LoginPayload,
  LoginResponse
} from "../types/auth.types";

export function useSignupMutation() {
  return useMutation<SignupResponse, Error, SignupPayload>({
    mutationFn: signup,
  });
}

export function useLoginMutation() {
  return useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: login,
  });
}

export function useResendVerificationMutation() {
  return useMutation<ResendVerificationResponse, Error, ResendVerificationPayload>({
    mutationFn: resendVerification,
  });
}
