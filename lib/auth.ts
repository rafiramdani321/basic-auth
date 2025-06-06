import { cookies } from "next/headers";
import { verifyToken } from "../utils/jwt";

export async function getCurrentUser() {
  const token = cookies().get("token")?.value;

  if (!token) return null;

  try {
    const decoded = await verifyToken(token);
    return decoded;
  } catch {
    return null;
  }
}
