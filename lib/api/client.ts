"use client";

import axios from "axios";
import { API_BASE_URL } from "@/utils/constants/api-routes";
import { normalizeApiError } from "./error-handler";
import { useOrganizationStore } from "@/features/organization/stores/organization.store";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 15000,
});

// Request interceptor: Auto-inject orgId from store into URL templates
api.interceptors.request.use(
  (config) => {
    // Only process URLs with {orgId} placeholder
    if (config.url?.includes('{orgId}')) {
      const currentOrgId = useOrganizationStore.getState().currentOrganization?.slug;
      
      if (!currentOrgId) {
        throw new Error('No organization selected. Please select an organization to continue.');
      }
      
      // Replace {orgId} placeholder with actual org slug
      config.url = config.url.replace(/{orgId}/g, String(currentOrgId));
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (res) => res,
  (error) => {
    // Always throw a normalized error object
    throw normalizeApiError(error);
  }
);
