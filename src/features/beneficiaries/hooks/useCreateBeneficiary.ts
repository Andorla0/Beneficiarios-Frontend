import { useMutation, useQueryClient } from "@tanstack/react-query";
import { beneficiariesApi } from "../api/beneficiariesApi";
import { queryKeys } from "../../../shared/api/queryKeys";

export function useCreateBeneficiary() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: beneficiariesApi.create,
    onSuccess: async () => {
      // invalida cualquier listado (params variables)
      await qc.invalidateQueries({ queryKey: queryKeys.beneficiaries.all });
    },
  });
}
