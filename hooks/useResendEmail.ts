import { useRouter } from "next/navigation";

export function useResendEmail() {
  const router = useRouter();

  const resendEmailVerification = async (email: string) => {
    const encodedEmail = btoa(email);
    try {
      const response = await fetch(`/api/auth/resend-email-verification`, {
        method: "POST",
        headers: { "Content-type": "Application/json" },
        body: JSON.stringify(email),
      });

      const status = response.ok ? "success" : "error";
      router.push(`/auth/resend-email?status=${status}&key=${encodedEmail}`);
    } catch {
      router.push(`/auth/resend-email?status=error&key=${encodedEmail}`);
    }
  };

  return { resendEmailVerification };
}
