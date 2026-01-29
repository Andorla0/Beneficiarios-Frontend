import type { ApiError } from "../types/api";

async function safeReadJson(res: Response): Promise<unknown | undefined> {
  try {
    return await res.json();
  } catch {
    return undefined;
  }
}

export async function toApiError(res: Response): Promise<ApiError> {
  const details = await safeReadJson(res);

  const message =
    (details && typeof details === "object" && "error" in details && typeof details.error === "string" ? details.error : undefined) ??
    (details && typeof details === "object" && "message" in details && typeof details.message === "string" ? details.message : undefined) ??
    res.statusText ??
    "Request failed";

  return {
    status: res.status,
    message,
    details,
  };
}

export function getErrorMessage(err: unknown): string {
  if (typeof err === "string") return err;
  if (typeof err === "object" && err !== null && "message" in err) {
    const m = err.message;
    if (typeof m === "string") return m;
  }
  return "Ocurrió un error inesperado.";
}
