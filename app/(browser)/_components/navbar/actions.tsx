"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { userDecodeToken } from "@/types/user-types";

interface userProps {
  user: userDecodeToken | null;
}

const Actions = ({ user }: userProps) => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ email: user?.email }),
      });
      if (res.ok) {
        router.refresh();
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {user ? (
        <button
          disabled={loading}
          onClick={handleLogout}
          className="text-emerald-600 font-semibold text-base border bg-background px-2.5 py-1 rounded-md hover:ring-2 hover:ring-emerald-400"
        >
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
