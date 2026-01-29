import { getApiBaseUrl } from "../../app/config/env";
import { toApiError } from "./httpErrors";


type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export type RequestOptions = {
  method?: HttpMethod;
  params?: Record<string, string | number | boolean | undefined | null>;
  body?: unknown;
  signal?: AbortSignal;
  headers?: Record<string, string>;
};

function buildUrl(path: string, params?: RequestOptions["params"]) {
  const base = getApiBaseUrl();
  const url = new URL(path, base || window.location.origin);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null || value === "") continue;
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = buildUrl(path, options.params);

  const res = await fetch(url, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    signal: options.signal,
  });

  if (!res.ok) {
    throw await toApiError(res);
  }

  // 204 No Content
  if (res.status === 204) {
    return undefined as T;
  }

  return (await res.json()) as T;
}
