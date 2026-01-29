import { Link, useNavigate, useParams } from "react-router-dom";

import { Button } from "../../../shared/ui/Button/Button";
import { Spinner } from "../../../shared/ui/Spinner/Spinner";
import { ErrorState } from "../../../shared/ui/ErrorState/ErrorState";
import { getErrorMessage } from "../../../shared/api/httpErrors";

import { useBeneficiary } from "../hooks/useBeneficiary";
import { useDeleteBeneficiary } from "../hooks/useDeleteBeneficiary";
import { useActiveIdentityDocuments } from "../../documents/hooks/useActiveIdentityDocuments";

function toId(value: string | undefined) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export function BeneficiaryDetailsPage() {
  const { id } = useParams();
  const beneficiaryId = toId(id);

  const navigate = useNavigate();

  const detailQuery = useBeneficiary(beneficiaryId);
  const deleteMutation = useDeleteBeneficiary();

  // Catalogo de documentos (para fallback cuando b.document no viene)
  const docsQuery = useActiveIdentityDocuments();
  const docsById = new Map((docsQuery.data ?? []).map((d) => [d.id, d]));

  const b = detailQuery.data;

  async function onDelete() {
    const ok = window.confirm("¿Seguro que deseas eliminar este beneficiario?");
    if (!ok) return;

    await deleteMutation.mutateAsync(beneficiaryId);
    navigate("/beneficiaries");
  }

  // Decide cuál documento mostrar: primero b.document si viene, si no, catálogo por ID
  const resolvedDoc =
    b?.document?.id ? b.document : b ? docsById.get(b.identityDocumentId) : undefined;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Detalle del beneficiario</h1>
          <p className="mt-1 text-sm text-slate-600">ID: {beneficiaryId}</p>
        </div>

        <div className="flex items-center gap-2">
          <Link to={`/beneficiaries/${beneficiaryId}/edit`}>
            <Button variant="secondary">Editar</Button>
          </Link>
          <Button variant="danger" onClick={onDelete} disabled={deleteMutation.isPending}>
            {deleteMutation.isPending ? "Eliminando..." : "Eliminar"}
          </Button>
          <Link to="/beneficiaries">
            <Button variant="ghost">Volver</Button>
          </Link>
        </div>
      </div>

      {detailQuery.isLoading ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <Spinner />
        </section>
      ) : detailQuery.isError ? (
        <ErrorState message={getErrorMessage(detailQuery.error)} onRetry={() => detailQuery.refetch()} />
      ) : !b ? (
        <ErrorState message="No se encontró el beneficiario." />
      ) : (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="text-xs font-medium text-slate-500">Nombres</div>
              <div className="mt-1 text-sm font-semibold text-slate-900">{b.firstNames}</div>
            </div>

            <div>
              <div className="text-xs font-medium text-slate-500">Apellidos</div>
              <div className="mt-1 text-sm font-semibold text-slate-900">{b.lastNames}</div>
            </div>

            <div>
              <div className="text-xs font-medium text-slate-500">Documento</div>
              <div className="mt-1 text-sm text-slate-900">
                {resolvedDoc ? (
                  <>
                    {b.documentNumber}
                  </>
                ) : (
                  <>
                    ID:{b.identityDocumentId} - {b.documentNumber}
                  </>
                )}
              </div>
            </div>

            <div>
              <div className="text-xs font-medium text-slate-500">Nacimiento</div>
              <div className="mt-1 text-sm text-slate-900">{b.birthDate}</div>
            </div>

            <div>
              <div className="text-xs font-medium text-slate-500">Género</div>
              <div className="mt-1 text-sm text-slate-900">{b.gender}</div>
            </div>

            <div>
              <div className="text-xs font-medium text-slate-500">Tipo documento</div>
              <div className="mt-1 text-sm text-slate-900">
                {resolvedDoc ? (
                  <>
                     {resolvedDoc.name} ({resolvedDoc.country}) 
                  </>
                ) : (
                  <>ID: {b.identityDocumentId}</>
                )}
              </div>
            </div>
          </div>

          {/* Si docsQuery falla, no bloqueamos el detalle: solo no habrá fallback */}
          {docsQuery.isError ? (
            <div className="mt-4">
              <ErrorState
                title="Aviso"
                message={`No se pudo cargar catálogo de documentos para mostrar labels. ${getErrorMessage(
                  docsQuery.error
                )}`}
              />
            </div>
          ) : null}

          {deleteMutation.isError ? (
            <div className="mt-4">
              <ErrorState message={getErrorMessage(deleteMutation.error)} />
            </div>
          ) : null}
        </section>
      )}
    </div>
  );
}
