import { Link, useNavigate } from "react-router-dom";
import { useActiveIdentityDocuments } from "../../documents/hooks/useActiveIdentityDocuments";
import { useCreateBeneficiary } from "../hooks/useCreateBeneficiary";

import { Spinner } from "../../../shared/ui/Spinner/Spinner";
import { ErrorState } from "../../../shared/ui/ErrorState/ErrorState";
import { Button } from "../../../shared/ui/Button/Button";
import { BeneficiaryForm } from "../components/BeneficiaryForm";
import { getErrorMessage } from "../../../shared/api/httpErrors";

export function BeneficiaryCreatePage() {
  const navigate = useNavigate();
  const docsQuery = useActiveIdentityDocuments();
  const createMutation = useCreateBeneficiary();

  const isLoading = docsQuery.isLoading;
  const isError = docsQuery.isError;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Nuevo beneficiario</h1>
          <p className="mt-1 text-sm text-slate-600">Crear un beneficiario.</p>
        </div>
        <Link to="/beneficiaries">
          <Button variant="ghost">Volver</Button>
        </Link>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {isLoading ? (
          <Spinner />
        ) : isError ? (
          <ErrorState
            message={getErrorMessage(docsQuery.error)}
            onRetry={() => docsQuery.refetch()}
          />
        ) : (
          <BeneficiaryForm
            documents={docsQuery.data ?? []}
            submitLabel="Crear"
            isSubmitting={createMutation.isPending}
            onCancel={() => navigate("/beneficiaries")}
            onSubmit={async (values) => {
              const created = await createMutation.mutateAsync(values);
              // si el backend devuelve Beneficiary, navegamos a detalle
              if (created?.id) navigate(`/beneficiaries/${created.id}`);
              else navigate("/beneficiaries");
            }}
          />
        )}

        {createMutation.isError ? (
          <div className="mt-4">
            <ErrorState message={getErrorMessage(createMutation.error)} />
          </div>
        ) : null}
      </section>
    </div>
  );
}
