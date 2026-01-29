export function EmptyState({
  title = "Sin resultados",
  message = "No se encontraron registros con los filtros actuales.",
}: {
  title?: string;
  message?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      <div className="mt-1 text-sm text-slate-600">{message}</div>
    </div>
  );
}
