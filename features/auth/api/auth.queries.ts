"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { signup, resendVerification, login, forgotPassword, resetPassword, setPassword, getUser, logout } from "./auth.api";
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
  ResetPasswordResponse,
  SetPasswordPayload,
  SetPasswordResponse,
  UserResponse
} from "../types/auth.types";

export const authKeys = {
  user: ["auth", "user"] as const,
};

export function useUser(options?: { enabled?: boolean }) {
  return useQuery<UserResponse, Error>({
    queryKey: authKeys.user,
    queryFn: getUser,
    retry: false,
    staleTime: Infinity, // Cache forever (until hard refresh or invalidation)
    enabled: options?.enabled ?? true,
    // Don't throw errors for 401/403 - these are expected on auth pages
    throwOnError: false,
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(authKeys.user, null);
      queryClient.invalidateQueries({ queryKey: authKeys.user });
    },
  });
}

export function useSignupMutation() {
  return useMutation<SignupResponse, Error, SignupPayload>({
    mutationFn: signup,
  });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();
  return useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.user });
    },
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

export function useSetPasswordMutation() {
  const queryClient = useQueryClient();
  return useMutation<SetPasswordResponse, Error, SetPasswordPayload>({
    mutationFn: setPassword,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.user });
    },
  });
}
