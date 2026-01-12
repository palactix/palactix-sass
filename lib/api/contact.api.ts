import { api } from "@/lib/api/client";

export interface ContactFormPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactFormResponse {
  message: string;
}

export async function submitContactForm(payload: ContactFormPayload) {
  const res = await api.post<ContactFormResponse>("/contact", payload);
  return res.data;
}
