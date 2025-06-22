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

type Params = {
  params: {
    token: string;
  };
};

export async function GET(_: Request, { params }: Params) {
  const { token } = params;
  if (!token) {
    return new AppError("Token is missing", 400);
  }

  try {
    const payload = jwt.verify(token, process.env.EMAIL_VERIFICATION_SECRET!, {
      ignoreExpiration: true,
    }) as { email: string };

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

      throw innerError;
    }

    await updateIsVerifiedByUserId(user.id);
    await deleteTokenByUserId(user.id, token);

    return successResponse("Email verified successfully", 200);
  } catch (error) {
    if (error instanceof AppError) {
      return errorResponse(error.message, error.statusCode, error.details);
    }
    return errorResponse("Invalid token format, Please check your url", 500);
  }
}
