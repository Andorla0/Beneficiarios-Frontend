export type Gender = "M" | "F";

export type IdentityDocumentDto = {
  id: number;
  name: string;
  abbreviation: string;
  country: string;
  length: number;
  numericOnly: boolean;
  isActive: boolean;
};

export type BeneficiaryDto = {
  id: number;
  firstNames: string;
  lastNames: string;
  identityDocumentId: number;
  documentNumber: string;
  birthDate: string; // "YYYY-MM-DD"
  gender: Gender;
  document: IdentityDocumentDto;
};

export type CreateBeneficiaryRequest = {
  firstNames: string;
  lastNames: string;
  identityDocumentId: number;
  documentNumber: string;
  birthDate: string; // "YYYY-MM-DD"
  gender: Gender;
};

export type PagedResult<T> = {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
};
