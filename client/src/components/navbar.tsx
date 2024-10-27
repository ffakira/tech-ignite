import { Link, NavLink } from "react-router-dom";

export function Navbar() {
  return (
    <nav className="shadow-lg h-20 flex items-center justify-between px-8 lg:px-20">
      <Link className="font-semibold text-xl" to="/">
        📅 Events Manager
      </Link>
      <NavLink
        className="hover:border-b hover:border-black aria-[current=page]:font-bold aria-[current=page]:text-blue-500 aria-[current=page]:border-b aria-[current=page]:border-blue-500"
        to="/events/new"
      >
        New Event
      </NavLink>
    </nav>
  );
}
