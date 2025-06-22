import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

const LayoutProfile = async ({ children }: { children: React.ReactNode }) => {
  const user = await getCurrentUser();
  if (!user) return redirect("/");
  return <div>{children}</div>;
};

export default LayoutProfile;
