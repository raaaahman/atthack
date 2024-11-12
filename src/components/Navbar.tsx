import { UserIcon } from "@heroicons/react/24/outline";
import { HomeIcon } from "@heroicons/react/24/outline";
import { Link, useLocation } from "@tanstack/react-router";
import clsx from "clsx";

export const Navbar = () => {
  const pathname = useLocation({ select: (location) => location.pathname });

  return (
    <nav className="btm-nav [position:static_!important;]">
      <button className={clsx(pathname === "/" ? "active" : "")}>
        <Link to="/">
          <span className="sr-only">Home</span>
          <HomeIcon
            title="Home"
            role="presentation"
            className="size-8 m-2 md:size-12 md:m-4"
          />
        </Link>
      </button>
      <button className={clsx(pathname === "/contacts" ? "active" : "")}>
        <Link className="block" to="/contacts">
          <span className="sr-only">Contacts</span>
          <UserIcon
            title="Contacts"
            role="presentation"
            className="size-8 m-2 md:size-12 md:m-4"
          />
        </Link>
      </button>
    </nav>
  );
};
