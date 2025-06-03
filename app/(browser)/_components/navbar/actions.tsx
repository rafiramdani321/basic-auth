"use client";

import React from "react";
import Link from "next/link";
import { userDecodeToken } from "@/types/user-types";

interface userProps {
  user: userDecodeToken | null;
}

const Actions = ({ user }: userProps) => {
  return (
    <>
      {user ? (
        <button className="text-emerald-600 font-semibold text-base border bg-background px-2.5 py-1 rounded-md hover:ring-2 hover:ring-emerald-400">
          Logout
        </button>
      ) : (
        <Link
          href={"/signin"}
          className="text-emerald-600 font-semibold text-base border bg-background px-2.5 py-1 rounded-md hover:ring-2 hover:ring-emerald-400"
        >
          Login
        </Link>
      )}
    </>
  );
};

export default Actions;
