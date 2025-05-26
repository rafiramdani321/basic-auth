"use client";

import React from "react";
import Link from "next/link";
import clsx from "clsx";

import { showToastError, showToastSuccess } from "@/lib/toast";

const Registration = () => {
  const [formData, setFormData] = React.useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = React.useState<Partial<typeof formData>>({});
  const [autoFocus, setAutoFocus] = React.useState(false);

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
    if (!autoFocus) return;

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
  }, [errors, autoFocus]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const newErrors: Partial<typeof formData> = {};

    if (formData.username.trim() === "")
      newErrors.username = "Username required!";
    if (formData.email.trim() === "") newErrors.email = "Email required!";
    if (formData.password.trim() === "")
      newErrors.password = "Password required!";
    if (formData.confirmPassword.trim() === "")
      newErrors.confirmPassword = "Confirm password required!";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Confirm password do not match!";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setAutoFocus(true);
      showToastError("Please fix the form errors");
      return;
    }

    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    showToastSuccess("registraion success");
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
            <label className="block text-base text-neutral-700 font-semibold">
              Username
            </label>
            <input
              ref={(e) => {
                inputRef.current.username = e;
              }}
              type="text"
              name="username"
              className={clsx(
                "w-full h-9 rounded-md px-2",
                errors.username
                  ? "border border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                  : "border-2 border-gray-300 focus:outline-none"
              )}
              value={formData.username}
              onChange={handleOnChange}
              autoFocus
            />
            {errors.username && (
              <p className="text-red-500 text-xs ml-1 font-semibold">
                {errors.username}
              </p>
            )}
          </div>
          <div className="mb-5">
            <label className="block text-base text-neutral-700 font-semibold">
              Email
            </label>
            <input
              ref={(e) => {
                inputRef.current.email = e;
              }}
              type="email"
              name="email"
              className={clsx(
                "w-full h-9 rounded-md px-2",
                errors.email
                  ? "border border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                  : "border-2 border-gray-300 focus:outline-none"
              )}
              value={formData.email}
              onChange={handleOnChange}
            />
            {errors.email && (
              <p className="text-red-500 text-xs ml-1 font-semibold">
                {errors.email}
              </p>
            )}
          </div>
          <div className="flex gap-x-5 mb-2">
            <div>
              <label className="block text-base text-neutral-700 font-semibold">
                Password
              </label>
              <input
                ref={(e) => {
                  inputRef.current.password = e;
                }}
                type="password"
                name="password"
                className={clsx(
                  "w-full h-9 rounded-md px-2",
                  errors.password
                    ? "border border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                    : "border-2 border-gray-300 focus:outline-none"
                )}
                value={formData.password}
                onChange={handleOnChange}
              />
              {errors.password && (
                <p className="text-red-500 text-xs ml-1 font-semibold">
                  {errors.password}
                </p>
              )}
            </div>
            <div>
              <label className="block text-base text-neutral-700 font-semibold">
                Confirm Password
              </label>
              <input
                ref={(e) => {
                  inputRef.current.confirmPassword = e;
                }}
                type="password"
                name="confirmPassword"
                className={clsx(
                  "w-full h-9 rounded-md px-2",
                  errors.confirmPassword
                    ? "border border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                    : "border-2 border-gray-300 focus:outline-none"
                )}
                value={formData.confirmPassword}
                onChange={handleOnChange}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs ml-1 font-semibold">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>
          <p className="text-xs">
            you have an account yet?{" "}
            <Link href={"/signin"} className="text-emerald-600 hover:underline">
              signin
            </Link>
          </p>
          <div className="text-center mt-10">
            <button className="uppercase text-white font-semibold rounded-md bg-emerald-600 px-3 py-1 hover:shadow-md hover:shadow-emerald-500">
              Signup
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registration;
