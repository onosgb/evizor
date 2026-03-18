"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "../lib/services";
import { ApiError } from "../models";
import { FormInput } from "../components/ui/FormInput";
import { Button } from "../components/ui/button";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await authService.forgotPassword(email);
      // Redirect to reset password page with email query param
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message || "Failed to send reset code. Please try again.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      console.error("Forgot password error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8">

        {/* Logo + heading */}
        <div className="text-center mb-6">
          <Image
            src="/images/evizor_logo_dark.png"
            alt="eVizor"
            width={140}
            height={40}
            className="h-10 w-auto mx-auto mb-4"
          />
          <h2 className="text-2xl font-semibold text-gray-900">Forgot Your Password?</h2>
          <p className="text-gray-500 mt-2">
            Enter your registered email address and we&apos;ll send you a verification code to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <FormInput
            label="Email Address"
            type="email"
            id="inputEmail"
            placeholder="Enter your email"
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
          />

          {/* Error */}
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            disabled={isLoading}
            variant="default"
            size="lg"
            className="w-full font-semibold"
          >
            {isLoading ? "Sending..." : "Send Verification Code"}
          </Button>
        </form>

        {/* Back to login */}
        <div className="mt-6 text-center text-sm">
          <Link href="/login" className="text-blue-600 hover:underline font-medium">
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
