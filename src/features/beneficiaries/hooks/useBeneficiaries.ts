import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../../shared/api/queryKeys";
import type { BeneficiariesQuery } from "../types";
import { beneficiariesApi } from "../api/beneficiariesApi";


export function useBeneficiaries(query: BeneficiariesQuery) {
  return useQuery({
    queryKey: queryKeys.beneficiaries.list(query),
    queryFn: () => beneficiariesApi.list(query)
  });
}
