import { api } from "@/lib/api/client";

import type { 
  SignupPayload, 
  SignupResponse, 
  ResendVerificationPayload, 
  ResendVerificationResponse,
  LoginPayload,
  LoginResponse
} from "../types/auth.types";
import { AUTH_API_ROUTES } from "@/utils/constants/api-routes";

export async function signup(payload: SignupPayload) {
  const res = await api.post<SignupResponse>(AUTH_API_ROUTES.SIGNUP, payload);
  return res.data;
}

export async function login(payload: LoginPayload) {
  const res = await api.post<LoginResponse>(AUTH_API_ROUTES.LOGIN, payload);
  return res.data;
}

export async function resendVerification(payload: ResendVerificationPayload) {
  const res = await api.post<ResendVerificationResponse>(AUTH_API_ROUTES.RESEND_VERIFICATION, payload);
  return res.data;
}
