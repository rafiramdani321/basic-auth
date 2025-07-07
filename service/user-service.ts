import {
  createUserParams,
  loginParams,
  updatePasswordParams,
} from "@/types/user-types";
import { AppError } from "@/lib/errors";
import bcrypt from "bcrypt";
import {
  createUser,
  findUserByEmail,
  findUserByUsername,
  updatePasswordByUserId,
} from "@/repositories/user-repository";
import {
  loginValidation,
  registrationValidation,
  updatePasswordValidation,
  validationResponses,
} from "@/lib/validationSchema";
import {
  createToken,
  deleteTokenByUserId,
} from "@/repositories/token-repository";
import { sendMail } from "@/lib/email";
import { emailVerificationToken } from "@/utils/jwt";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;

export const registrationService = async (data: createUserParams) => {
  const errorsValidation = registrationValidation.safeParse(data);
  if (!errorsValidation.success) {
    const errors = validationResponses(errorsValidation);
    throw new AppError("Validation failed!", 400, errors);
  }

  const dbErrors: { field: keyof createUserParams; message: string }[] = [];

  const existingUsername = await findUserByUsername(data.username);
  if (existingUsername) {
    dbErrors.push({ field: "username", message: "Username already taken." });
  }

  const existingEmail = await findUserByEmail(data.email);
  if (existingEmail) {
    dbErrors.push({ field: "email", message: "Email already taken." });
  }

  if (dbErrors.length > 0) {
    throw new AppError("Validation failed!", 400, dbErrors);
  }

  const hashPassword = await bcrypt.hash(data.password, 10);

  const newUserData = await createUser({
    ...data,
    password: hashPassword,
  });

  const token = emailVerificationToken(newUserData.email);
  const one_hour = 60 * 60 * 1000;
  const newTokenData = {
    userId: newUserData.id,
    token,
    verifyExp: new Date(Date.now() + one_hour),
  };
  await createToken(newTokenData);

  const url = `${BASE_URL}/auth/verify-account/${token}`;
  const message = `<p>Click the link below to verify your email</p><a href="${url}">${url}</a>`;
  await sendMail(newUserData.email, `Verification account : `, message);

  return newUserData;
};

export const loginService = async (data: loginParams) => {
  const errorValidation = loginValidation.safeParse(data);
  if (!errorValidation.success) {
    const errors = validationResponses(errorValidation);
    throw new AppError("Validation failed", 400, errors);
  }

  const user = await findUserByEmail(data.email);
  const isValidPassword = user
    ? await bcrypt.compare(data.password, user.password)
    : false;

  if (!user || !isValidPassword) {
    throw new AppError("Email / Password incorrect", 400);
  }

  if (!user.isVerified) {
    throw new AppError(
      "Your email has not been activated. Please check your email or you can request a new activation link.",
      400,
      [
        {
          field: "request_new_verification",
          message: "Request new verification email.",
        },
      ]
    );
  }

  return {
    id: user.id,
    email: user.email,
    username: user.username,
  };
};

export const updatePassword = async (data: updatePasswordParams) => {
  const errorsValidation = updatePasswordValidation.safeParse(data);
  if (!errorsValidation.success) {
    const errors = validationResponses(errorsValidation);
    throw new AppError("Validation failed!", 400, errors);
  }

  const dbErrors: { field: keyof updatePasswordParams; message: string }[] = [];

  const existingUser = await findUserByEmail(data.email);
  if (!existingUser) {
    dbErrors.push({ field: "email", message: "user not found" });
  }

  if (dbErrors.length > 0) {
    throw new AppError("Validation failed", 400, dbErrors);
  }

  const hashPassword = await bcrypt.hash(data.password, 10);
  const update = await updatePasswordByUserId(existingUser!.id, hashPassword);
  await deleteTokenByUserId(existingUser!.id);
  return update;
};
