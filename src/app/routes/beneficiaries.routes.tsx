import { Navigate } from "react-router-dom";

import { BeneficiariesPage } from "../../features/beneficiaries/pages/BeneficiariesPage";
import { BeneficiaryDetailsPage } from "../../features/beneficiaries/pages/BeneficiaryDetailsPage";
import { BeneficiaryCreatePage } from "../../features/beneficiaries/pages/BeneficiaryCreatePage";
import { BeneficiaryEditPage } from "../../features/beneficiaries/pages/BeneficiaryEditPage";

export const beneficiariesRoutes = [
  { index: true, element: <Navigate to="/beneficiaries" replace /> },
  { path: "/beneficiaries", element: <BeneficiariesPage /> },
  { path: "/beneficiaries/new", element: <BeneficiaryCreatePage /> },
  { path: "/beneficiaries/:id", element: <BeneficiaryDetailsPage /> },
  { path: "/beneficiaries/:id/edit", element: <BeneficiaryEditPage /> },
] as const;
