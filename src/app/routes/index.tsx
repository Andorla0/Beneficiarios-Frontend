import { createBrowserRouter } from "react-router-dom";
import { beneficiariesRoutes } from "./beneficiaries.routes";
import { NotFoundPage } from "./pages/NotFoundPage";
import { AppLayout } from "./layout/AppLayout";

export const router = createBrowserRouter([
  {
    element: <AppLayout/>,
    children: [...beneficiariesRoutes],
    errorElement: <NotFoundPage />,
  },
]);
