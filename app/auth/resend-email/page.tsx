"use client";

import { useResendEmail } from "@/hooks/useResendEmail";
import { showToastError } from "@/lib/toast";
import clsx from "clsx";
import { CheckIcon, Loader2, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React from "react";

const ResendEmail = () => {
  const { resendEmailVerification } = useResendEmail();
  const params = useSearchParams();
  const status = params.get("status");
  const emailEncoded = params.get("key");
  const email = emailEncoded ? atob(emailEncoded) : null;

  const [loadingResend, setLoadingResend] = React.useState(false);

  let Icon;
  if (status === "success") {
    Icon = CheckIcon;
  } else {
    Icon = X;
  }

  const handleResendEmail = async () => {
    if (!email) {
      return showToastError("Something went wrong");
    }
    await resendEmailVerification(email);
  };

  let message;
  if (status === "error") {
    message = "An error occurred while sending the verification email.";
  } else if (status === "success") {
    message = "Verification email sent successfully! Please check your inbox.";
  } else {
    message = "Something went wrong, please try again later.";
  }
  return (
    <div className="flex w-full h-screen justify-center items-center">
      <div
        className={clsx(
          "border-2 shadow-md shadow-emerald-400/50 rounded-md p-10 w-[500px] flex flex-col items-center",
          status === "error" && "shadow-red-400/50"
        )}
      >
        {loadingResend ? (
          <Loader2 className="w-20 h-20 animate-spin text-emerald-500" />
        ) : (
          <p className="flex items-center gap-x-2 mb-4 text-neutral-700 font-semibold text-xl">
            <Icon
              className={clsx(
                "w-16 h-16",
                status === "error" ? "text-red-500" : "text-emerald-500"
              )}
            />
            {message}
          </p>
        )}
        {status === "error" ? (
          <button
            disabled={loadingResend}
            onClick={() => handleResendEmail()}
            className={clsx(
              "mt-4 border-2 rounded-md px-2 bg-emerald-400 shadow-md text-white hover:shadow-emerald-400/50"
            )}
          >
            Try to resend verification
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default ResendEmail;
