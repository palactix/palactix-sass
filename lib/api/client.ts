"use client";

import axios from "axios";
import { API_BASE_URL } from "@/utils/constants/api-routes";
import { normalizeApiError } from "./error-handler";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 15000,
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    // Always throw a normalized error object
    throw normalizeApiError(error);
  }
);
