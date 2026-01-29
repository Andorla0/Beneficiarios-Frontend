import { useQuery } from "@tanstack/react-query";
import { beneficiariesApi } from "../api/beneficiariesApi";
import { queryKeys } from "../../../shared/api/queryKeys";

export function useBeneficiary(id: number) {
  return useQuery({
    queryKey: queryKeys.beneficiaries.detail(id),
    queryFn: () => beneficiariesApi.getById(id),
    enabled: Number.isFinite(id) && id > 0,
  });
}
