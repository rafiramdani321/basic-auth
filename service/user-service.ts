import { createUserParams, loginParams } from "@/types/user-types";
import { AppError } from "@/lib/errors";
import bcrypt from "bcrypt";
import {
  createUser,
  findUserByEmail,
  findUserByUsername,
} from "@/repositories/user-repository";
import {
  loginValidation,
  registrationValidation,
  validationResponses,
} from "@/lib/validationSchema";

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

  return {
    id: user.id,
    email: user.email,
    username: user.username,
  };
};
