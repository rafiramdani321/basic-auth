"use client";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { CheckIcon, X, Loader2 } from "lucide-react";
import clsx from "clsx";
import jwt from "jsonwebtoken";
import { showToastSuccess } from "@/lib/toast";
import { useResendEmail } from "@/hooks/useResendEmail";

const PageVerifyEmail = () => {
  const { resendEmailVerification } = useResendEmail();
  const params = useParams();
  const router = useRouter();
  const token = Array.isArray(params.token) ? params.token[0] : params.token;
  const [status, setStatus] = React.useState<"loading" | "success" | "error">(
    "loading"
  );
  const [loadingResend, setLoadingResend] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [resendEmail, setResendEmail] = React.useState(false);

  const hasRun = React.useRef(false);
  React.useEffect(() => {
    if (!token || hasRun.current) return;
    handleVerifyEmail();
  }, [token]);

  const handleVerifyEmail = async () => {
    hasRun.current = true;
    try {
      const res = await fetch(`/api/auth/verify-email/${token}`, {
        method: "GET",
        headers: { "Content-type": "application/json" },
      });

      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        if (data.details && data.details === "token has expired") {
          setResendEmail(true);
        }
        setMessage(data.error);
        return;
      }

      setStatus("success");
      router.push("/auth/signin");
      showToastSuccess("Email verified successfully", "top-center", 5000);
    } catch (error) {
      console.log(error);
    }
  };

  let Icon;
  if (status === "error") {
    Icon = X;
  } else if (status === "success") {
    Icon = CheckIcon;
  } else {
    Icon = Loader2;
  }

  const handleResendEmail = async () => {
    if (!token) return;
    const decoded = jwt.decode(token) as { email?: string };
    if (!decoded?.email) return;
    setLoadingResend(true);
    await resendEmailVerification(decoded.email);
  };

  return (
    <div className="flex w-full h-screen justify-center items-center">
      <div
        className={clsx(
          "border-2 shadow-md shadow-emerald-400/50 rounded-md p-10 w-[500px] flex flex-col items-center",
          status === "error" && "shadow-red-400/50"
        )}
      >
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
        {loadingResend ? (
          <Loader2 className="w-20 h-20 animate-spin text-emerald-500" />
        ) : resendEmail && status === "error" ? (
          <button
            disabled={loadingResend}
            onClick={() => handleResendEmail()}
            className={clsx(
              "mt-4 font-semibold text-neutral-700 underline hover:text-emerald-500"
            )}
          >
            Resend verification
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default PageVerifyEmail;
