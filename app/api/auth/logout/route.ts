import { errorResponse, successResponse } from "@/lib/responses";
import { cookies } from "next/headers";

export async function POST() {
  try {
    cookies().set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });

    return successResponse("Logout success", 200);
  } catch (error) {
    return errorResponse("Internal Server Error", 500);
  }
}
