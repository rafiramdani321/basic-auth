import { NextRequest, userAgent } from "next/server";
import { cookies } from "next/headers";
import { captchaLimiter, rateLimiter } from "@/utils/rate-limitter";

import { signToken } from "@/utils/jwt";
import { loginService } from "@/service/user-service";
import { AppError } from "@/lib/errors";
import { errorResponse, successResponse } from "@/lib/responses";
import { verifyCaptcha } from "@/utils/captcha";
import { loginLogger } from "@/lib/logger/login-logger";

export async function POST(req: NextRequest) {
  const ip = req.ip || req.headers.get("x-forwarded-for") || "unknown";
  const userAgent = req.headers.get("user-agent") || "unknown";
  const data = await req.json();

  let needCaptcha = false;
  const captchaData = await captchaLimiter.get(ip);
  if (captchaData && captchaData.remainingPoints <= 0) {
    needCaptcha = true;
  } else {
    needCaptcha = false;
  }

  if (needCaptcha) {
    if (!data.captchaResponse) {
      return errorResponse("Please complete CAPTCHA to continue", 400);
    }
    const validCaptcha = await verifyCaptcha(data.captchaResponse);
    if (!validCaptcha) {
      return errorResponse("CAPTCHA verification failed", 400);
    }
  }

  try {
    const user = await loginService(data);

    loginLogger.info({
      event: "login_success",
      email: user.email,
      ip,
      userAgent,
      timestamp: new Date().toISOString(),
    });

    await rateLimiter.delete(ip);
    await captchaLimiter.delete(ip);

    const token = signToken(
      { id: user.id, email: user.email, username: user.username },
      "1h"
    );
    cookies().set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60,
      path: "/",
    });

    return successResponse("Login successfully", 200, user);
  } catch (error) {
    if (error instanceof AppError) {
      try {
        await rateLimiter.consume(ip);

        if (!needCaptcha) {
          await captchaLimiter.consume(ip);
        }
      } catch {
        return errorResponse(
          "Too many failed login attempts, please try later.",
          429
        );
      }

      loginLogger.error({
        event: "login_failed",
        email: data.email,
        ip,
        userAgent,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
      return errorResponse(error.message, error.statusCode, error.details);
    }
    return errorResponse("Internal Server Error", 500);
  }
}
