import { Link, useSearchParams } from "react-router-dom";

import { Button } from "../../../shared/ui/Button/Button";
import { Input } from "../../../shared/ui/Input/Input";
import { Select } from "../../../shared/ui/Select/Select";
import { Spinner } from "../../../shared/ui/Spinner/Spinner";
import { ErrorState } from "../../../shared/ui/ErrorState/ErrorState";
import { EmptyState } from "../../../shared/ui/EmptyState/EmptyState";

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "../../../app/config/constants";

import { useActiveIdentityDocuments } from "../../documents/hooks/useActiveIdentityDocuments";
import { useBeneficiaries } from "../hooks/useBeneficiaries";

import { getErrorMessage } from "../../../shared/api/httpErrors";

import type { BeneficiariesQuery } from "../types";
import type { BeneficiaryDto } from "../../../shared/types/domain";

function toInt(value: string | null, fallback: number) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function toOptionalNumber(value: string | null): number | undefined {
  if (!value) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

function setParam(sp: URLSearchParams, key: string, value: string) {
  const next = new URLSearchParams(sp);
  if (!value) next.delete(key);
  else next.set(key, value);

  // Siempre que cambia un filtro, regresamos a Page=1
  if (key !== "Page") next.set("Page", "1");
  return next;
}

function fullName(b: BeneficiaryDto) {
  return `${b.firstNames} ${b.lastNames}`.trim();
}

export function BeneficiariesPage() {
  const [sp, setSp] = useSearchParams();

  const page = toInt(sp.get("Page"), DEFAULT_PAGE);
  const pageSize = toInt(sp.get("PageSize"), DEFAULT_PAGE_SIZE);

  const Name = sp.get("Name") ?? "";
  const DocumentNumber = sp.get("DocumentNumber") ?? "";
  const IdentityDocumentIdStr = sp.get("IdentityDocumentId") ?? "";

  const query: BeneficiariesQuery = {
    Page: page,
    PageSize: pageSize,
    Name: Name || undefined,
    DocumentNumber: DocumentNumber || undefined,
    IdentityDocumentId: toOptionalNumber(IdentityDocumentIdStr),
  };

  const docsQuery = useActiveIdentityDocuments();
  const listQuery = useBeneficiaries(query);

  const docsOptions =
    (docsQuery.data ?? []).map((d) => ({
      value: String(d.id),
      label: `${d.name} (${d.country})`,
    })) ?? [];

  const pageSizeOptions = PAGE_SIZE_OPTIONS.map((n) => ({ value: String(n), label: String(n) }));

  const isLoading = docsQuery.isLoading || listQuery.isLoading;
  const isError = docsQuery.isError || listQuery.isError;

  const errorMessage = docsQuery.error
    ? getErrorMessage(docsQuery.error)
    : listQuery.error
      ? getErrorMessage(listQuery.error)
      : "Ocurrió un error inesperado.";

  function goToPage(nextPage: number) {
    const next = new URLSearchParams(sp);
    next.set("Page", String(nextPage));
    next.set("PageSize", String(pageSize));
    setSp(next, { replace: true });
  }

  function clearFilters() {
    setSp(new URLSearchParams({ Page: "1", PageSize: String(DEFAULT_PAGE_SIZE) }), { replace: true });
  }

  const result = listQuery.data as
    | { items: BeneficiaryDto[]; totalCount: number; totalPages: number; page: number }
    | undefined;
  const items = result?.items ?? [];
  const totalPages = result?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Beneficiarios</h1>
          <p className="mt-1 text-sm text-slate-600">
            Listado con filtros opcionales y paginación (query params).
          </p>
        </div>

        <Link to="/beneficiaries/new">
          <Button>Nuevo beneficiario</Button>
        </Link>
      </div>

      {/* Filters */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-4">
          <Input
            label="Nombre"
            placeholder="Buscar por nombre..."
            value={Name}
            onChange={(e) => setSp(setParam(sp, "Name", e.target.value), { replace: true })}
          />
          <Input
            label="Nro. documento"
            placeholder="Buscar por documento..."
            value={DocumentNumber}
            onChange={(e) => setSp(setParam(sp, "DocumentNumber", e.target.value), { replace: true })}
          />
          <Select
            label="Tipo documento"
            value={IdentityDocumentIdStr}
            onChange={(e) => setSp(setParam(sp, "IdentityDocumentId", e.target.value), { replace: true })}
            options={docsOptions}
            placeholder={docsQuery.isLoading ? "Cargando..." : "Todos"}
          />
          <Select
            label="PageSize"
            value={String(pageSize)}
            onChange={(e) => setSp(setParam(sp, "PageSize", e.target.value), { replace: true })}
            options={pageSizeOptions}
            placeholder="Tamaño"
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button variant="secondary" onClick={clearFilters}>
            Limpiar
          </Button>

          <div className="ml-auto text-xs text-slate-500">
            {result ? (
              <>
                Total: <span className="font-medium text-slate-700">{result.totalCount}</span> · Page{" "}
                <span className="font-medium text-slate-700">{result.page}</span> /{" "}
                <span className="font-medium text-slate-700">{result.totalPages}</span>
              </>
            ) : (
              <>
                Page=<span className="font-medium text-slate-700">{page}</span> PageSize=
                <span className="font-medium text-slate-700">{pageSize}</span>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">Resultados</h2>
        </div>

        {isLoading ? (
          <Spinner />
        ) : isError ? (
          <div className="mt-4">
            <ErrorState
              message={errorMessage}
              onRetry={() => {
                docsQuery.refetch();
                listQuery.refetch();
              }}
            />
          </div>
        ) : items.length === 0 ? (
          <div className="mt-4">
            <EmptyState />
          </div>
        ) : (
          <>
            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs font-semibold text-slate-700">
                  <tr>
                    <th className="px-4 py-3">Nombre</th>
                    <th className="px-4 py-3">Documento</th>
                    <th className="px-4 py-3">Nacimiento</th>
                    <th className="px-4 py-3">Género</th>
                    <th className="px-4 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {items.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">{fullName(b)}</td>
                      <td className="px-4 py-3">
                        {b.documentNumber}
                      </td>
                      <td className="px-4 py-3">{b.birthDate}</td>
                      <td className="px-4 py-3">{b.gender}</td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          className="text-sm font-medium text-slate-900 hover:underline"
                          to={`/beneficiaries/${b.id}`}
                        >
                          Ver
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between">
              <Button
                variant="secondary"
                onClick={() => goToPage(Math.max(1, page - 1))}
                disabled={page <= 1}
              >
                Anterior
              </Button>

              <div className="text-sm text-slate-600">
                Página <span className="font-medium text-slate-800">{page}</span> de{" "}
                <span className="font-medium text-slate-800">{totalPages}</span>
              </div>

              <Button
                variant="secondary"
                onClick={() => goToPage(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages}
              >
                Siguiente
              </Button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
