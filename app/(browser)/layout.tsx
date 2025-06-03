export const dynamic = "force-dynamic";

import React from "react";

import Navbar from "./_components/navbar";
import { getCurrentUser } from "@/lib/auth";

const LayoutBrowser = async ({ children }: { children: React.ReactNode }) => {
  const user = await getCurrentUser();
  return (
    <>
      <Navbar user={user} />
      <div className="mt-5 px-56">{children}</div>
    </>
  );
};

export default LayoutBrowser;
