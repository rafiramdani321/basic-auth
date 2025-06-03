"use client";

import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";

import { showToastError, showToastSuccess } from "@/lib/toast";
import { loginValidation, validationResponses } from "@/lib/validationSchema";
import { buildErrorMap } from "@/lib/errorMap";
import { revalidatePath } from "next/cache";

const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });
  const [visiblePassword, setVisiblePassword] = React.useState(false);
  const [autoFocus, setAutoFocus] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<
    Partial<Record<keyof typeof formData, string[]>>
  >({});

  const inputRef = React.useRef<{
    email: HTMLInputElement | null;
    password: HTMLInputElement | null;
  }>({
    email: null,
    password: null,
  });

  React.useEffect(() => {
    if (!autoFocus) return;
    if (errors.email && inputRef.current.email) {
      inputRef.current.email.focus();
    } else if (errors.password && inputRef.current.password) {
      inputRef.current.password.focus();
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
      [name]: [],
    }));
  };

  const IconPassword = visiblePassword ? EyeOff : Eye;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const errorValidationFront = loginValidation.safeParse(formData);
    if (!errorValidationFront.success) {
      const errorsFront = validationResponses(errorValidationFront);
      setErrors(buildErrorMap<keyof typeof formData>(errorsFront));
      setAutoFocus(true);
      return;
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-type": "application/json" },
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
        email: "",
        password: "",
      });
      showToastSuccess(data.messages);
      router.push("/");
      router.refresh();
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
            sign in
          </h2>
        </div>
        <form className="p-10 w-[500px]" onSubmit={onSubmit}>
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
              autoFocus
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
          <div className="mb-2 relative">
            <label
              htmlFor="password"
              className="block text-base text-neutral-700 font-semibold"
            >
              Password
            </label>
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
            <div className="absolute right-0 top-9 mr-3">
              <IconPassword
                onClick={() => setVisiblePassword(!visiblePassword)}
                className="w-4 h-4 cursor-pointer"
              />
            </div>
            {errors.password?.map((msg, i) => (
              <p key={i} className="text-red-500 text-xs ml-1 font-semibold">
                {`- ${msg}`}
              </p>
            ))}
          </div>
          <p className="text-xs">
            you don't have an account yet?{" "}
            <Link href={"/signup"} className="text-emerald-600 hover:underline">
              signup
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
              Signin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
