import type { AxiosError } from "axios";

export type NormalizedApiError = {
  status?: number;
  message: string;
  fieldErrors?: Record<string, string>;
  retryAfterSeconds?: number;
};

export function normalizeApiError(err: unknown): NormalizedApiError {
  const defaultError: NormalizedApiError = { message: "Something went wrong" };

  const axiosErr = err as AxiosError<unknown>;
  const status = axiosErr?.response?.status;
  const data = axiosErr?.response?.data as unknown;
  const body = (data ?? {}) as Record<string, unknown>;

  // Laravel common structures
  // 422: { message: string, errors: { field: string[] } }
  // 429: { message: string }
  // 401/403: { message: string }
  // 500+: { message?: string }

  if (!status) return defaultError;

  if (status === 422 && body && typeof body === "object") {
    const fieldErrors: Record<string, string> = {};
    const errs = body.errors as Record<string, unknown> | undefined;
    if (errs && typeof errs === "object") {
      for (const key of Object.keys(errs)) {
        const val = errs[key];
        const first = Array.isArray(val) ? val[0] : val;
        if (typeof first === "string") fieldErrors[key] = first;
      }
    }
    return {
      status,
      message: typeof body.message === "string" ? (body.message as string) : "Validation error",
      fieldErrors,
    };
  }

  if (status === 429) {
    const retryAfter = axiosErr.response?.headers?.["retry-after"];
    const retryAfterSeconds = retryAfter ? Number(retryAfter) : undefined;
    return {
      status,
      message: (body.message as string) ?? "Too many requests. Please try again later.",
      retryAfterSeconds,
    };
  }

  if (status === 401 || status === 403) {
    return {
      status,
      message: (body.message as string) ?? "You are not authorized to perform this action.",
    };
  }

  return {
    status,
    message: (body.message as string) ?? defaultError.message,
  };
}
