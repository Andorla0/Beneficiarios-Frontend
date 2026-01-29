import { useMutation, useQueryClient } from "@tanstack/react-query";
import { beneficiariesApi } from "../api/beneficiariesApi";
import { queryKeys } from "../../../shared/api/queryKeys";
import type { CreateBeneficiaryRequest } from "../../../shared/types/domain";

export function useUpdateBeneficiary(id: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBeneficiaryRequest) => beneficiariesApi.update(id, payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: queryKeys.beneficiaries.all });
    },
  });
}
