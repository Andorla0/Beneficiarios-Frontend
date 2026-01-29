import { apiRequest } from "../../../shared/api/apiClient";
import type { BeneficiaryDto, CreateBeneficiaryRequest, PagedResult } from "../../../shared/types/domain";
import type { BeneficiariesQuery } from "../types";

export const beneficiariesApi = {
  list: (query: BeneficiariesQuery) =>
    apiRequest<PagedResult<BeneficiaryDto>>("/api/Beneficiaries", { params: query }),

  getById: (id: number) => apiRequest<BeneficiaryDto>(`/api/Beneficiaries/${id}`),

  create: (payload: CreateBeneficiaryRequest) =>
    apiRequest<BeneficiaryDto>("/api/Beneficiaries", { method: "POST", body: payload }),

  update: (id: number, payload: CreateBeneficiaryRequest) =>
    apiRequest<void | BeneficiaryDto>(`/api/Beneficiaries/${id}`, { method: "PUT", body: payload }),

  remove: (id: number) => apiRequest<void>(`/api/Beneficiaries/${id}`, { method: "DELETE" }),
};
