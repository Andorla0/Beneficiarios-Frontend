export type ApiError = {
  status: number;
  message: string;
  details?: unknown;
};

export function isApiError(err: unknown): err is ApiError {
  return (
    typeof err === "object" &&
    err !== null &&
    "status" in err &&
    "message" in err &&
    typeof (err as Record<string, unknown>).status === "number" &&
    typeof (err as Record<string, unknown>).message === "string"
  );
}
