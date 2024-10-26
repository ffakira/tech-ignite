import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <nav className="shadow-lg h-20 flex items-center justify-between px-8 lg:px-20">
      <Link className="font-semibold text-xl" to="/">
        📅 Events Manager
      </Link>
      <Link className="hover:underline" to="/events/new">
        New Event
      </Link>
    </nav>
  );
}
