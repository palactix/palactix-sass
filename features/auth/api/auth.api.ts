import { api } from "@/lib/api/client";

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
import { AUTH_API_ROUTES, AGENCY_ROUTES } from "@/utils/constants/api-routes";

export async function signup(payload: SignupPayload) {
  const res = await api.post<SignupResponse>(AUTH_API_ROUTES.SIGNUP, payload);
  return res.data;
}

export async function login(payload: LoginPayload) {
  const res = await api.post<LoginResponse>(AUTH_API_ROUTES.LOGIN, payload);
  return res.data;
}

export async function logout() {
  await api.post(AUTH_API_ROUTES.LOGOUT);
}

export async function getUser() {
  const res = await api.get<UserResponse>(AUTH_API_ROUTES.CHECK_AUTH);
  return res.data;
}

export async function resendVerification(payload: ResendVerificationPayload) {
  const res = await api.post<ResendVerificationResponse>(AUTH_API_ROUTES.RESEND_VERIFICATION, payload);
  return res.data;
}

export async function forgotPassword(payload: ForgotPasswordPayload) {
  const res = await api.post<ForgotPasswordResponse>(AUTH_API_ROUTES.FORGOT_PASSWORD, payload);
  return res.data;
}

export async function resetPassword(payload: ResetPasswordPayload) {
  const res = await api.post<ResetPasswordResponse>(AUTH_API_ROUTES.RESET_PASSWORD, payload);
  return res.data;
}

export async function setPassword(payload: SetPasswordPayload) {
  const res = await api.post<SetPasswordResponse>(AGENCY_ROUTES.CREATE_PASSWORD, payload);
  return res.data;
}
