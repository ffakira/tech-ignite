import { createBrowserRouter } from "react-router-dom";

import { RooLayout } from "@/components/layouts/root-layout";

import { NotFoundPage } from "@/pages/not-found";
import { NewEventPage } from "@/pages/event/new-event";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <RooLayout />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/events",
    element: <RooLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "new",
        element: <NewEventPage />,
      },
    ],
  },
]);
