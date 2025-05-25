"use client";

import { showToastError, showToastSuccess } from "@/lib/toast";
import Link from "next/link";
import React from "react";

const Login = () => {
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (formData.email.trim() === "") throw new Error("Email required!");
      if (formData.password.trim() === "")
        throw new Error("password required!");

      setFormData({
        email: "",
        password: "",
      });
      showToastSuccess("login success");
    } catch (error) {
      if (error instanceof Error) {
        showToastError(error.message);
      } else {
        showToastError("Internal server error");
      }
    }
  };

  return (
    <div className="w-full flex h-screen items-center justify-center">
      <div className="border-2 shadow-lg shadow-emerald-200">
        <div className="text-center mt-10">
          <h2 className="text-3xl font-bold text-emerald-600 uppercase">
            sign in
          </h2>
        </div>
        <form className="p-10" onSubmit={onSubmit}>
          <div>
            <label className="block text-base text-neutral-700 font-semibold">
              Email
            </label>
            <input
              type="email"
              name="email"
              className="w-[400px] h-9 rounded-md border-2 px-2"
              value={formData.email}
              onChange={handleOnChange}
              required
            />
          </div>
          <div>
            <label className="block text-base text-neutral-700 font-semibold">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="w-[400px] h-9 rounded-md border-2 px-2"
              value={formData.password}
              onChange={handleOnChange}
              required
            />
          </div>
          <p className="text-xs">
            you don't have an account yet?{" "}
            <Link href={"/signup"} className="text-emerald-600 hover:underline">
              signup
            </Link>
          </p>
          <div className="text-center mt-10">
            <button className="text-white font-semibold rounded-md bg-emerald-600 px-3 py-1 hover:shadow-md hover:shadow-emerald-500">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
