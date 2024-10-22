import { createBrowserRouter } from "react-router-dom";

import { RooLayout } from "@/components/layouts/root-layout";

import { NotFoundPage } from "@/pages/not-found";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <RooLayout />,
    errorElement: <NotFoundPage />,
  },
]);
