import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import jwt from "jsonwebtoken";

import { AppError } from "@/lib/errors";
import { verifyEmailToken } from "@/utils/jwt";
import { errorResponse, successResponse } from "@/lib/responses";
import {
  findUserByEmail,
  updateIsVerifiedByUserId,
} from "@/repositories/user-repository";
import {
  deleteTokenByUserId,
  findTokenByUserIdAndToken,
} from "@/repositories/token-repository";
import { NextRequest } from "next/server";
import { verifyEmailLogger } from "@/lib/logger/verify-email-logger";

type Params = {
  params: {
    token: string;
  };
};

export async function GET(req: NextRequest, { params }: Params) {
  const ip = req.ip || req.headers.get("x-forwarded-for") || "unknown";
  const userAgent = req.headers.get("user-agent") || "unknown";

  const { token } = params;
  if (!token) {
    return new AppError("Token is missing", 400);
  }
  const payload = jwt.verify(token, process.env.EMAIL_VERIFICATION_SECRET!, {
    ignoreExpiration: true,
  }) as { email: string };

  try {
    const user = await findUserByEmail(payload.email);
    if (!user) {
      throw new AppError("user not found", 404);
    }

    const storedToken = await findTokenByUserIdAndToken(user.id, token);
    if (!storedToken) {
      throw new AppError(
        "Invalid token, please check a new url on email or try to login.",
        400
      );
    }

    try {
      await verifyEmailToken(token);
    } catch (innerError) {
      if (
        innerError instanceof TokenExpiredError ||
        innerError instanceof JsonWebTokenError ||
        innerError instanceof AppError
      ) {
        verifyEmailLogger.error({
          event: "verify-email-failed",
          email: user.email,
          ip,
          userAgent,
          error: innerError.message,
          timestamp: new Date().toISOString(),
        });
      }

      if (innerError instanceof TokenExpiredError) {
        return errorResponse(
          "Token has expired. Please request a new verification email.",
          400,
          "token has expired"
        );
      }

      if (innerError instanceof JsonWebTokenError) {
        return errorResponse(
          "Invalid token format, Please check your url",
          400
        );
      }

      if (innerError instanceof AppError) {
        return errorResponse(innerError.message, innerError.statusCode);
      }

      throw innerError;
    }

    await updateIsVerifiedByUserId(user.id);
    await deleteTokenByUserId(user.id);

    verifyEmailLogger.info({
      event: "verify-email-success",
      email: user.email,
      ip,
      userAgent,
      timestamp: new Date().toISOString(),
    });

    return successResponse("Email verified successfully", 200);
  } catch (error) {
    if (error instanceof AppError) {
      verifyEmailLogger.error({
        event: "verify-email-failed",
        email: payload.email,
        ip,
        userAgent,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
      return errorResponse(error.message, error.statusCode, error.details);
    }
    return errorResponse("Invalid token format, Please check your url", 500);
  }
}
