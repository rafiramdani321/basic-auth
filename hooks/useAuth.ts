import { verifyToken } from "@/lib/jwt";
import { userDecodeToken } from "@/types/user-types";
import { cookies } from "next/headers";

export function useAuth(): { user: userDecodeToken | null } {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  const decoded = token ? verifyToken(token) : null;

  const user =
    decoded && typeof decoded === "object"
      ? (decoded as userDecodeToken)
      : null;

  return { user };
}
