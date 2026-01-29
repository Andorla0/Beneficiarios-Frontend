import { Button } from "../Button/Button";

export function ErrorState({
  title = "Ocurrió un error",
  message,
  onRetry,
}: {
  title?: string;
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5">
      <div className="text-sm font-semibold text-rose-800">{title}</div>
      <div className="mt-1 text-sm text-rose-700">{message}</div>
      {onRetry ? (
        <div className="mt-4">
          <Button variant="secondary" onClick={onRetry}>
            Reintentar
          </Button>
        </div>
      ) : null}
    </div>
  );
}
