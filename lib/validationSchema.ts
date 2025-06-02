import { z } from "zod";

export const registrationValidation = z
  .object({
    username: z
      .string()
      .nonempty("Username is required.")
      .min(3, "Usename must be at least 3 characters."),
    email: z
      .string()
      .nonempty("Email is required.")
      .email("Invalid email address."),
    password: z
      .string()
      .nonempty("Password is required.")
      .min(8, "Password must be at least 8 characters.")
      .regex(/[a-z]/, "Password Must include at least one lowercase letter.")
      .regex(/[A-Z]/, "Password Must include at least one uppercase letter.")
      .regex(/\d/, "Password Must include at least one number.")
      .regex(/[\W_]/, "Password Must include at least one special character."),
    confirmPassword: z.string().nonempty("Confirm password is required."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Confirm Password do not match.",
    path: ["confirmPassword"],
  });

export const validationResponses = (errors: any) => {
  const errorValidation = errors.error.issues.map(
    (issue: { path: string; message: string }) => ({
      field: String(issue.path[0]),
      message: issue.message,
    })
  );
  return errorValidation;
};
