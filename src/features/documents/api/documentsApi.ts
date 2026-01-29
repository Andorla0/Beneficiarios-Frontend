import { apiRequest } from "../../../shared/api/apiClient";
import type { ActiveIdentityDocumentsResponse } from "../types";

export const documentsApi = {
  getActive: () => apiRequest<ActiveIdentityDocumentsResponse>("/api/Documents/active"),
};
