"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import clsx from "clsx";
import { z } from "zod";
import { showToastError, showToastSuccess } from "@/lib/toast";

interface ForgotPasswordProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({
  open,
  onOpenChange,
}) => {
  const [email, setEmail] = React.useState("");
  const [errors, setErrors] = React.useState("");
  const [errorsApi, setErrorsApi] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrors("");
    setErrorsApi("");
    setEmail(e.target.value);
  };

  const openChange = () => {
    setEmail("");
    onOpenChange(false);
  };

  const emailSchema = z.string().email({ message: "Invalid email format" });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "" || email === null) {
      setErrors("Email is required!");
      return;
    }

    const checkEmail = emailSchema.safeParse(email);
    if (!checkEmail.success) {
      setErrors(checkEmail.error.errors[0].message);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(email),
      });

      const data = await response.json();
      if (!response.ok) {
        setErrorsApi(data.error);
        return;
      }

      setEmail("");
      onOpenChange(false);
      showToastSuccess(data.message, "top-center", 5000);
    } catch (error) {
      console.log(error);
      showToastError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={openChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>
            Enter your email and we will send you a link to reset your password.
            {errorsApi !== "" && (
              <p className="text-red-500 font-semibold text-xs mt-1">
                {errorsApi}
              </p>
            )}
            <form onSubmit={onSubmit}>
              <input
                autoFocus
                type="email"
                placeholder="youremail@gmail.com"
                className={clsx(
                  "border w-full h-8 px-2 rounded-md",
                  errors !== "" || errorsApi !== ""
                    ? "border-2 border-red-500"
                    : ""
                )}
                onChange={onChange}
                value={email}
              />
              {errors !== "" && (
                <p className="text-red-500 font-semibold text-xs ml-1">
                  {errors}
                </p>
              )}
              <div className="mt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="border bg-emerald-500 px-2 text-white rounded-md py-0.5 hover:bg-emerald-400"
                >
                  Send verification
                </button>
              </div>
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPassword;
