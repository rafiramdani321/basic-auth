import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

const LayoutAuth = async ({ children }: { children: React.ReactNode }) => {
  const user = await getCurrentUser();
  if (user) {
    redirect("/");
  }
  return children;
};

export default LayoutAuth;
