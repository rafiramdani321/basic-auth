import React from "react";
import NavLink from "./navlink";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-emerald-600 h-16 flex w-full">
      <div className="flex w-full items-center justify-between px-56">
        <NavLink />
        <Link
          href={"/signin"}
          className="text-emerald-600 font-semibold text-base border bg-background px-2.5 py-1 rounded-md hover:ring-2 hover:ring-emerald-400"
        >
          Login
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
