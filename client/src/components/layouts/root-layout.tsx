import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/navbar";

export function RooLayout() {
  return (
    <div>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
