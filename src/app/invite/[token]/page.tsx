"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";

export default function InvitePage() {
  const params = useParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "valid" | "invalid">(
    "loading"
  );
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetch(`/api/invite/${params.token}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.valid) {
          setStatus("valid");
          setEmail(data.email);
        } else {
          setStatus("invalid");
        }
      })
      .catch(() => setStatus("invalid"));
  }, [params.token]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-dark-muted">Verifying invitation...</p>
      </div>
    );
  }

  if (status === "invalid") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="card text-center max-w-md">
          <h1
            className="text-2xl font-bold mb-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Invalid Invitation
          </h1>
          <p className="text-dark-muted mb-4">
            This invitation link is invalid or has expired.
          </p>
          <button
            onClick={() => router.push("/")}
            className="btn-gold"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="card max-w-md w-full gold-glow text-center">
        <span className="text-gold text-sm font-semibold tracking-widest uppercase">
          1 Level Up
        </span>
        <h1
          className="text-2xl font-bold mt-3 mb-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          You&apos;re Invited
        </h1>
        <p className="text-dark-muted mb-6">
          Your coach has invited <span className="text-gold">{email}</span> to
          join 1 Level Up. Sign in to start tracking.
        </p>

        <div className="space-y-3">
          <button
            onClick={() =>
              signIn("google", { callbackUrl: "/onboarding" })
            }
            className="w-full flex items-center justify-center gap-3 border border-dark-border rounded-lg py-3 px-4 hover:border-gold transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <button
            onClick={() =>
              signIn("apple", { callbackUrl: "/onboarding" })
            }
            className="w-full flex items-center justify-center gap-3 border border-dark-border rounded-lg py-3 px-4 hover:border-gold transition-colors"
          >
            <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
              <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
            </svg>
            <span>Continue with Apple</span>
          </button>
        </div>
      </div>
    </div>
  );
}
