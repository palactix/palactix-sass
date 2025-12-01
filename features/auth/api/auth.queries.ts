"use client";

import { useMutation } from "@tanstack/react-query";
import { signup, resendVerification, login, forgotPassword, resetPassword } from "./auth.api";
import type { 
  SignupPayload, 
  SignupResponse, 
  ResendVerificationPayload, 
  ResendVerificationResponse,
  LoginPayload,
  LoginResponse,
  ForgotPasswordPayload,
  ForgotPasswordResponse,
  ResetPasswordPayload,
  ResetPasswordResponse
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

export function useForgotPasswordMutation() {
  return useMutation<ForgotPasswordResponse, Error, ForgotPasswordPayload>({
    mutationFn: forgotPassword,
  });
}

export function useResetPasswordMutation() {
  return useMutation<ResetPasswordResponse, Error, ResetPasswordPayload>({
    mutationFn: resetPassword,
  });
}
