"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

const NavLink = () => {
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
    </div>
  );
};

export default NavLink;
