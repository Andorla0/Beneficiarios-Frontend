import { useQuery } from "@tanstack/react-query";
import { documentsApi } from "../api/documentsApi";
import { queryKeys } from "../../../shared/api/queryKeys";

export function useActiveIdentityDocuments() {
  return useQuery({
    queryKey: queryKeys.documents.active,
    queryFn: documentsApi.getActive,
    staleTime: 5 * 60 * 1000,
  });
}
