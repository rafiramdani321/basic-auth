"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { userDecodeToken } from "@/types/user-types";

interface userProps {
  user: userDecodeToken | null;
}

const data = [
  {
    id: 1,
    name: "Home",
    href: "/",
  },
  {
    id: 2,
    name: "Service",
    href: "/service",
  },
  {
    id: 3,
    name: "About",
    href: "/about",
  },
];

const NavLink = ({ user }: userProps) => {
  const pathname = usePathname();
  return (
    <div className="flex gap-x-8 text-white font-semibold text-base uppercase">
      {data.map((item) => (
        <Link
          href={item.href}
          key={item.id}
          className={`hover:underline ${pathname === item.href && "underline"}`}
        >
          {item.name}
        </Link>
      ))}
      {user ? (
        <Link
          href={"/profile"}
          className={clsx(
            "hover:underline",
            pathname === "/profile" && "underline"
          )}
        >
          Profile
        </Link>
      ) : null}
    </div>
  );
};

export default NavLink;
