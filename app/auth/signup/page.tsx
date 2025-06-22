"use client";

import React from "react";
import Link from "next/link";
import clsx from "clsx";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";

import { showToastError, showToastSuccess } from "@/lib/toast";
import {
  registrationValidation,
  validationResponses,
} from "@/lib/validationSchema";
import { buildErrorMap } from "@/lib/errorMap";
import { useRouter } from "next/navigation";

const Registration = () => {
  const router = useRouter();
  const [formData, setFormData] = React.useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [visiblePassword, setVisiblePassword] = React.useState(false);
  const [visibleConfirmPassword, setVisibleConfirmPassword] =
    React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [autoFocues, setAutoFocus] = React.useState(false);
  const [errors, setErrors] = React.useState<
    Partial<Record<keyof typeof formData, string[]>>
  >({});

  const inputRef = React.useRef<{
    username: HTMLInputElement | null;
    email: HTMLInputElement | null;
    password: HTMLInputElement | null;
    confirmPassword: HTMLInputElement | null;
  }>({
    username: null,
    email: null,
    password: null,
    confirmPassword: null,
  });

  React.useEffect(() => {
    if (!autoFocues) return;
    if (errors.username && inputRef.current.username) {
      inputRef.current.username.focus();
    } else if (errors.email && inputRef.current.email) {
      inputRef.current.email.focus();
    } else if (errors.password && inputRef.current.password) {
      inputRef.current.password.focus();
    } else if (errors.confirmPassword && inputRef.current.confirmPassword) {
      inputRef.current.confirmPassword.focus();
    }
    setAutoFocus(false);
  }, [errors, autoFocues]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: [],
    }));
  };

  const IconPassword = visiblePassword ? EyeOff : Eye;
  const IconConfirmPassword = visibleConfirmPassword ? EyeOff : Eye;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);

    const errorsValidationFront = registrationValidation.safeParse(formData);
    if (!errorsValidationFront.success) {
      const errorsFront = validationResponses(errorsValidationFront);
      setErrors(buildErrorMap<keyof typeof formData>(errorsFront));
      setAutoFocus(true);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        if (data.details && Array.isArray(data.details)) {
          setErrors(buildErrorMap<keyof typeof formData>(data.details));
        }
        showToastError(data.error || "Something went wrong");
        return;
      }

      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setErrors({});
      showToastSuccess(data.message, "top-center", 7000);
      router.push("/auth/signin");
    } catch (error) {
      showToastError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex h-screen items-center justify-center">
      <div className="border-2 shadow-lg shadow-emerald-200">
        <div className="text-center mt-10">
          <h2 className="text-3xl font-bold text-emerald-600 uppercase">
            sign up
          </h2>
        </div>
        <form className="p-10" onSubmit={onSubmit}>
          <div className="mb-5">
            <label
              htmlFor="username"
              className="block text-base text-neutral-700 font-semibold"
            >
              Username
            </label>
            <input
              ref={(e) => {
                inputRef.current.username = e;
              }}
              type="text"
              name="username"
              id="username"
              aria-invalid={!!errors.username?.length}
              className={clsx(
                "w-full h-9 rounded-md px-2",
                errors.username?.length
                  ? "border border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                  : "border-2 border-gray-300 focus:outline-none"
              )}
              value={formData.username}
              onChange={handleOnChange}
              autoFocus
            />
            {errors.username?.map((msg, i) => (
              <p key={i} className="text-red-500 text-xs ml-1 font-semibold">
                {`- ${msg}`}
              </p>
            ))}
          </div>
          <div className="mb-5">
            <label
              htmlFor="email"
              className="block text-base text-neutral-700 font-semibold"
            >
              Email
            </label>
            <input
              ref={(e) => {
                inputRef.current.email = e;
              }}
              type="email"
              name="email"
              id="email"
              aria-invalid={!!errors.email?.length}
              className={clsx(
                "w-full h-9 rounded-md px-2",
                errors.email?.length
                  ? "border border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                  : "border-2 border-gray-300 focus:outline-none"
              )}
              value={formData.email}
              onChange={handleOnChange}
            />
            {errors.email?.map((msg, i) => (
              <p key={i} className="text-red-500 text-xs ml-1 font-semibold">
                {`- ${msg}`}
              </p>
            ))}
          </div>
          <div className="flex gap-x-3 mb-2">
            <div className="w-full">
              <label
                htmlFor="password"
                className="block text-base text-neutral-700 font-semibold"
              >
                Password
              </label>
              <div className="relative">
                <input
                  ref={(e) => {
                    inputRef.current.password = e;
                  }}
                  type={visiblePassword ? "text" : "password"}
                  name="password"
                  id="password"
                  aria-invalid={!!errors.password?.length}
                  className={clsx(
                    "w-full h-9 rounded-md pl-2 pr-10",
                    errors.password?.length
                      ? "border border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                      : "border-2 border-gray-300 focus:outline-none"
                  )}
                  value={formData.password}
                  onChange={handleOnChange}
                />
                <div className="absolute right-0 top-2.5 mr-3">
                  <IconPassword
                    onClick={() => setVisiblePassword(!visiblePassword)}
                    className="h-4 w-4 cursor-pointer"
                  />
                </div>
              </div>
              {errors.password?.map((msg, i) => (
                <p key={i} className="text-red-500 text-xs ml-1 font-semibold">
                  {`- ${msg}`}
                </p>
              ))}
            </div>
            <div className="w-full">
              <label
                htmlFor="confirmPassword"
                className="block text-base text-neutral-700 font-semibold"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  ref={(e) => {
                    inputRef.current.confirmPassword = e;
                  }}
                  type={visibleConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  id="confirmPassword"
                  aria-invalid={!!errors.confirmPassword?.length}
                  className={clsx(
                    "w-full h-9 rounded-md pl-2 pr-10",
                    errors.confirmPassword?.length
                      ? "border border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                      : "border-2 border-gray-300 focus:outline-none"
                  )}
                  value={formData.confirmPassword}
                  onChange={handleOnChange}
                />
                <div className="absolute right-0 top-2.5 mr-3">
                  <IconConfirmPassword
                    onClick={() =>
                      setVisibleConfirmPassword(!visibleConfirmPassword)
                    }
                    className="h-4 w-4 cursor-pointer"
                  />
                </div>
              </div>
              {errors.confirmPassword?.map((msg, i) => (
                <p key={i} className="text-red-500 text-xs ml-1 font-semibold">
                  {`- ${msg}`}
                </p>
              ))}
            </div>
          </div>
          <p className="text-xs">
            you have an account yet?{" "}
            <Link
              href={"/auth/signin"}
              className="text-emerald-600 hover:underline"
            >
              signin
            </Link>
          </p>
          <div className="flex justify-center mt-10">
            <button
              disabled={loading}
              className={clsx(
                "uppercase text-xl flex gap-x-2 items-center text-white font-semibold rounded-md px-5 py-1",
                loading
                  ? "bg-emerald-600/40"
                  : "bg-emerald-600 hover:shadow-md hover:shadow-emerald-500"
              )}
            >
              {loading ? (
                <LoaderCircle className="font-semibold animate-spin" />
              ) : null}
              Signup
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registration;
