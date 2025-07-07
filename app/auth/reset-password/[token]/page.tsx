"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import clsx from "clsx";
import { CheckIcon, Loader2, X } from "lucide-react";
import { buildErrorMap } from "@/lib/errorMap";
import { showToastError, showToastSuccess } from "@/lib/toast";
import {
  updatePasswordValidation,
  validationResponses,
} from "@/lib/validationSchema";

const ResetPassword = () => {
  const params = useParams();
  const router = useRouter();
  const token = Array.isArray(params.token) ? params.token[0] : params.token;
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = React.useState("");
  const [status, setStatus] = React.useState<"loading" | "success" | "error">(
    "loading"
  );
  const [errors, setErrors] = React.useState<
    Partial<Record<keyof typeof formData, string[]>>
  >({});
  const [loadingForm, setLoadingForm] = React.useState(false);

  useEffect(() => {
    if (!token) return;
    handleVerifyToken();
  }, [token]);

  const handleVerifyToken = async () => {
    setLoadingForm(true);
    try {
      const response = await fetch(
        `/api/auth/verify-forget-password/${token}`,
        {
          method: "GET",
          headers: { "Content-type": "application/json" },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        setStatus("error");
        setMessage(data.error);
        return;
      }

      setFormData((prev) => ({
        ...prev,
        email: data.data,
      }));

      setStatus("success");
      return;
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingForm(false);
    }
  };

  let Icon;
  if (status === "error") {
    Icon = X;
  } else if (status === "loading") {
    Icon = Loader2;
  } else {
    Icon = CheckIcon;
  }

  const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingForm(true);

    const errorsValidationFront = updatePasswordValidation.safeParse(formData);
    if (!errorsValidationFront.success) {
      const errorsFront = validationResponses(errorsValidationFront);
      setErrors(buildErrorMap<keyof typeof formData>(errorsFront));
      setLoadingForm(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        setErrors(buildErrorMap<keyof typeof formData>(data.details));
        showToastError(data.error || "Something went wrong.");
        return;
      }

      setErrors({});
      setFormData({ password: "", confirmPassword: "", email: "" });
      showToastSuccess(data.message, "top-center", 5000);
      router.push("/auth/signin");
    } catch (error) {
      console.log(error);
      showToastError("Something went wrong");
    } finally {
      setLoadingForm(false);
    }
  };

  return (
    <div className="w-full flex h-screen items-center justify-center">
      <div
        className={clsx(
          "border-2 shadow-lg",
          status === "error" ? "shadow-red-400" : "shadow-emerald-500"
        )}
      >
        {status === "error" || status === "loading" ? (
          <div className="w-[500px] p-10 flex flex-col items-center">
            <p className="flex items-center gap-x-2 mb-4 text-neutral-700 font-semibold text-xl">
              <Icon
                className={clsx(
                  "w-20 h-20 text-emerald-500",
                  status === "error" && "text-red-500",
                  status === "loading" && "animate-spin"
                )}
              />
              {message}
            </p>
          </div>
        ) : (
          <div>
            <div className="text-center mt-10">
              <h2 className="text-3xl font-bold text-emerald-600 uppercase">
                Reset Password
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-10 w-[500px]">
              <div className="mb-5">
                <label
                  htmlFor="password"
                  className="block text-base text-neutral-700 font-semibold"
                >
                  Password
                </label>
                <input
                  autoFocus
                  type="password"
                  id="password"
                  name="password"
                  className={clsx(
                    "w-full border h-9 rounded-md px-2",
                    errors.password?.length
                      ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                      : "border-gray-300 focus:outline-none"
                  )}
                  value={formData.password}
                  onChange={handleOnchange}
                />
                {errors.password?.map((msg, i) => (
                  <p
                    key={i}
                    className="text-red-500 text-xs ml-1 font-semibold"
                  >
                    {`- ${msg}`}
                  </p>
                ))}
              </div>
              <div className="mb-2 relative">
                <label
                  htmlFor="confirmPassword"
                  className="block text-base text-neutral-700 font-semibold"
                >
                  Confirm Password
                </label>
                <input
                  type={"password"}
                  name="confirmPassword"
                  id="confirmPassword"
                  className={clsx(
                    "w-full border h-9 rounded-md px-2",
                    errors.confirmPassword?.length
                      ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                      : "border-gray-300 focus:outline-none"
                  )}
                  value={formData.confirmPassword}
                  onChange={handleOnchange}
                />
                {errors.confirmPassword?.map((msg, i) => (
                  <p
                    key={i}
                    className="text-red-500 text-xs ml-1 font-semibold"
                  >
                    {`- ${msg}`}
                  </p>
                ))}
              </div>
              <div className="flex justify-center mt-5">
                <button
                  disabled={loadingForm}
                  type="submit"
                  className="border bg-emerald-500 w-full text-white py-1 font-semibold uppercase rounded-md"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
