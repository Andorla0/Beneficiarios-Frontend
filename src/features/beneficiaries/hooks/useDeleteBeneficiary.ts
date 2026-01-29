import { useMutation, useQueryClient } from "@tanstack/react-query";
import { beneficiariesApi } from "../api/beneficiariesApi";
import { queryKeys } from "../../../shared/api/queryKeys";

export function useDeleteBeneficiary() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => beneficiariesApi.remove(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: queryKeys.beneficiaries.all });

    },
  });
}
