import React from "react";
import NavLink from "./navlink";

import Actions from "./actions";
import { userDecodeToken } from "@/types/user-types";

interface userProps {
  user: userDecodeToken | null;
}

const Navbar = ({ user }: userProps) => {
  return (
    <nav className="bg-emerald-600 h-16 flex w-full">
      <div className="flex w-full items-center justify-between px-56">
        <NavLink />
        <Actions user={user} />
      </div>
    </nav>
  );
};

export default Navbar;
