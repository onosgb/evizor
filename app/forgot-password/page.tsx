"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "../lib/services";
import { ApiError } from "../models";

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

          {/* Email */}
          <div>
            <label htmlFor="inputEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="inputEmail"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition"
              placeholder="Enter your email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Sending..." : "Send Verification Code"}
          </button>
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
