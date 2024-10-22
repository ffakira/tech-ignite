import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/navbar";

export function RooLayout() {
  return (
    <main className="grid h-dvh grid-rows-[auto,1fr]">
      <Navbar />
      <div className="mx-20 h-[calc(100dvh-theme(spacing.14))] pt-4">
        <Outlet />
      </div>
    </main>
  );
}
