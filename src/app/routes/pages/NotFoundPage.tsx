import { Link, useRouteError } from "react-router-dom";

export function NotFoundPage() {
  const err = useRouteError();
  type RouteError = { statusText?: string };
  const message =
    (typeof err === "object" && err && "statusText" in err && (err as RouteError).statusText) ||
    "Página no encontrada";

  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <h1 className="text-xl font-semibold">Ups</h1>
      <p className="mt-2 text-sm text-slate-600">{String(message)}</p>
      <Link
        to="/beneficiaries"
        className="mt-6 inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
      >
        Volver a Beneficiarios
      </Link>
    </div>
  );
}
