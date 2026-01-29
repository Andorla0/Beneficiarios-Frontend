export const queryKeys = {
  documents: {
    active: ["documents", "active"] as const,
  },
  beneficiaries: {
    all: ["beneficiaries"] as const,
    list: (params: Record<string, unknown>) => ["beneficiaries", "list", params] as const,
    detail: (id: number) => ["beneficiaries", "detail", id] as const,
  },
};
