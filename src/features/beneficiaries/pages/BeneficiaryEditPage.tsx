import { Link, useNavigate, useParams } from "react-router-dom";
import { useActiveIdentityDocuments } from "../../documents/hooks/useActiveIdentityDocuments";
import { useBeneficiary } from "../hooks/useBeneficiary";
import { useUpdateBeneficiary } from "../hooks/useUpdateBeneficiary";

import { Spinner } from "../../../shared/ui/Spinner/Spinner";
import { ErrorState } from "../../../shared/ui/ErrorState/ErrorState";
import { Button } from "../../../shared/ui/Button/Button";
import { BeneficiaryForm } from "../components/BeneficiaryForm";
import { getErrorMessage } from "../../../shared/api/httpErrors";

function toId(value: string | undefined) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export function BeneficiaryEditPage() {
  const { id } = useParams();
  const beneficiaryId = toId(id);
  const navigate = useNavigate();

  const docsQuery = useActiveIdentityDocuments();
  const beneficiaryQuery = useBeneficiary(beneficiaryId);
  const updateMutation = useUpdateBeneficiary(beneficiaryId);

  const isLoading = docsQuery.isLoading || beneficiaryQuery.isLoading;
  const isError = docsQuery.isError || beneficiaryQuery.isError;

  const errorMessage = docsQuery.isError
    ? getErrorMessage(docsQuery.error)
    : getErrorMessage(beneficiaryQuery.error);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Editar beneficiario</h1>
          <p className="mt-1 text-sm text-slate-600">ID: {beneficiaryId}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to={`/beneficiaries/${beneficiaryId}`}>
            <Button variant="ghost">Volver</Button>
          </Link>
        </div>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {isLoading ? (
          <Spinner />
        ) : isError ? (
          <ErrorState message={errorMessage} onRetry={() => { docsQuery.refetch(); beneficiaryQuery.refetch(); }} />
        ) : (
          <BeneficiaryForm
            documents={docsQuery.data ?? []}
            defaultValues={{
              firstNames: beneficiaryQuery.data?.firstNames ?? "",
              lastNames: beneficiaryQuery.data?.lastNames ?? "",
              identityDocumentId: beneficiaryQuery.data?.identityDocumentId ?? (docsQuery.data?.[0]?.id ?? 0),
              documentNumber: beneficiaryQuery.data?.documentNumber ?? "",
              birthDate: beneficiaryQuery.data?.birthDate ?? "",
              gender: beneficiaryQuery.data?.gender ?? "M",
            }}
            submitLabel="Guardar cambios"
            isSubmitting={updateMutation.isPending}
            onCancel={() => navigate(`/beneficiaries/${beneficiaryId}`)}
            onSubmit={async (values) => {
              await updateMutation.mutateAsync(values);
              navigate(`/beneficiaries/${beneficiaryId}`);
            }}
          />
        )}

        {updateMutation.isError ? (
          <div className="mt-4">
            <ErrorState message={getErrorMessage(updateMutation.error)} />
          </div>
        ) : null}
      </section>
    </div>
  );
}
