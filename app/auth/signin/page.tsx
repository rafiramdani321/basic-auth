"use client";

import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { Eye, EyeOff, LoaderCircle, X } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";

import { showToastError, showToastSuccess } from "@/lib/toast";
import { loginValidation, validationResponses } from "@/lib/validationSchema";
import { buildErrorMap } from "@/lib/errorMap";
import { toast } from "sonner";
import { useResendEmail } from "@/hooks/useResendEmail";
import ForgotPassword from "../_components/forgot-password";

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

const Login = () => {
  const { resendEmailVerification } = useResendEmail();
  const router = useRouter();
  const recaptchaRef = React.useRef<ReCAPTCHA>(null);

  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });
  const [visiblePassword, setVisiblePassword] = React.useState(false);
  const [autoFocus, setAutoFocus] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [showCaptcha, setShowCaptcha] = React.useState(false);
  const [captchaToken, setCaptchaToken] = React.useState<string | null>(null);
  const [errors, setErrors] = React.useState<
    Partial<Record<keyof typeof formData, string[]>>
  >({});
  const [forgotPasswordModal, setForgotPasswordModal] = React.useState(false);

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

  const handleResendEmail = async () => {
    toast.dismiss();
    if (!formData.email) {
      return showToastError("Something went wrong");
    }

    await resendEmailVerification(formData.email);
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
      setLoading(false);
      return;
    }

    const bodyData: any = { ...formData };
    if (showCaptcha) {
      if (!captchaToken) {
        showToastError("Please complete CAPTCHA");
        setLoading(false);
        return;
      }
      bodyData.captchaResponse = captchaToken;
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();
      if (!response.ok) {
        if (data?.details[0]?.field === "request_new_verification") {
          showToastError(
            <div className="flex gap-x-4">
              <span>
                {data.error}.{" "}
                <button
                  className="text-emerald-500 underline font-semibold"
                  onClick={() => handleResendEmail()}
                >
                  Resend verification
                </button>
              </span>
              <div>
                <X
                  onClick={() => toast.dismiss()}
                  className="h-5 w-5 cursor-pointer"
                />
              </div>
            </div>,
            "top-center",
            Infinity
          );
          setFormData((prev) => ({
            ...prev,
            password: "",
          }));
          return;
        }
        if (
          data.error?.toLowerCase().includes("captcha") ||
          data.error?.toLowerCase().includes("complete captcha")
        ) {
          setShowCaptcha(true);
          if (recaptchaRef.current) recaptchaRef.current.reset();
          setCaptchaToken(null);
        }

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
      setErrors({});
      setShowCaptcha(false);
      if (recaptchaRef.current) recaptchaRef.current.reset();
      setCaptchaToken(null);

      showToastSuccess(data.message || "Login Success");
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

          {showCaptcha && (
            <div className="mb-4">
              <ReCAPTCHA
                sitekey={RECAPTCHA_SITE_KEY}
                onChange={(token) => setCaptchaToken(token)}
                ref={recaptchaRef}
              />
            </div>
          )}

          <div className="flex justify-between">
            <p className="text-xs">
              you don't have an account yet?{" "}
              <Link
                href={"/auth/signup"}
                className="text-emerald-600 hover:underline"
              >
                signup
              </Link>
            </p>
            <button
              type="button"
              onClick={() => setForgotPasswordModal(true)}
              className="text-xs hover:underline hover:text-emerald-500"
            >
              Forgot password?
            </button>
          </div>
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
        <ForgotPassword
          open={forgotPasswordModal}
          onOpenChange={setForgotPasswordModal}
        />
      </div>
    </div>
  );
};

export default Login;
