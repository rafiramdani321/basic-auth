import { AppError } from "@/lib/errors";
import { NextRequest } from "next/server";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { findUserByEmail } from "@/repositories/user-repository";
import {
  deleteTokenByUserId,
  findTokenByUserIdAndToken,
} from "@/repositories/token-repository";
import { verifyForgetPasswordToken } from "@/utils/jwt";
import { errorResponse, successResponse } from "@/lib/responses";

type Params = {
  params: {
    token: string;
  };
};

export async function GET(req: NextRequest, { params }: Params) {
  const { token } = params;

  if (!token) {
    return errorResponse("Token is missing.", 400);
  }

  let payload: { email: string };

  // Decode dan validasi token (meskipun expired)
  try {
    payload = jwt.verify(token, process.env.FORGET_PASSWORD_TOKEN_SECRET!, {
      ignoreExpiration: true,
    }) as { email: string };
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return errorResponse("Token has expired.", 400, "token has expired");
    }
    if (error instanceof JsonWebTokenError) {
      return errorResponse("Invalid token format, Please check your URL", 400);
    }
    return errorResponse("Invalid token.", 400);
  }

  try {
    const user = await findUserByEmail(payload.email);
    if (!user) {
      return errorResponse("User not found.", 400);
    }

    const storedToken = await findTokenByUserIdAndToken(user.id, token);
    if (!storedToken) {
      return errorResponse(
        "Invalid or expired token. Please request a new one.",
        400
      );
    }

    // Verifikasi token (cek exp, signature, dsb)
    try {
      await verifyForgetPasswordToken(token); // akan error jika expired/invalid
    } catch (verifyError) {
      if (verifyError instanceof TokenExpiredError) {
        return errorResponse("Token has expired.", 400, "token has expired");
      }
      if (verifyError instanceof JsonWebTokenError) {
        return errorResponse(
          "Invalid token format, Please check your URL",
          400
        );
      }
      if (verifyError instanceof AppError) {
        return errorResponse(verifyError.message, verifyError.statusCode);
      }
      // Unknown error
      throw verifyError;
    }

    // Token valid
    return successResponse(
      "Verify token success, please update your password",
      200,
      user.email
    );
  } catch (error) {
    console.error(error);
    if (error instanceof AppError) {
      return errorResponse(error.message, error.statusCode, error.details);
    }
    return errorResponse(
      "Something went wrong while verifying your token.",
      500
    );
  }
}
