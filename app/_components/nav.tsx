import Link from "next/link";
import React from "react";

const data = [
  {
    id: 1,
    name: "Home",
    slug: "/",
  },
  {
    id: 2,
    name: "Service",
    slug: "service",
  },
  {
    id: 3,
    name: "About",
    slug: "about",
  },
];

const NavLink = () => {
  return (
    <div className="flex gap-x-8 text-white font-semibold text-base uppercase">
      {data.map((item) => (
        <Link href={item.slug} key={item.id} className="hover:underline">
          {item.name}
        </Link>
      ))}
    </div>
  );
};

export default NavLink;
