"use client";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-navy-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <form className="form-signin" onSubmit={handleSubmit}>
          <div className="text-center mb-8">
            <div className="mx-auto h-20 w-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
               </svg>
            </div>
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-navy-50 mb-2">
              Forgot Password?
            </h2>
            <p className="text-slate-600 dark:text-navy-300">
              Don't worry! Enter your email and we'll send you a verification code to reset your password.
            </p>
          </div>

          <div className="space-y-4">
            <div className="form-label-group">
              <input
                type="email"
                id="inputEmail"
                className="form-control w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-700 text-slate-800 dark:text-navy-100 placeholder-slate-400 dark:placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent"
                placeholder="Email address"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label
                htmlFor="inputEmail"
                className="block mt-2 text-sm font-medium text-slate-700 dark:text-navy-200"
              >
                Email address
              </label>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 mb-4">
                <p className="text-sm text-red-800 dark:text-red-200">
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-lg btn-primary1 btn-block w-full py-3 px-4 rounded-lg bg-primary text-white font-medium hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:bg-accent dark:hover:bg-accent-focus disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Sending..." : "Send Verification Code"}
            </button>

            <Link
              href="/login"
              className="block w-full py-3 px-4 rounded-lg border border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-700 text-slate-800 dark:text-navy-100 font-medium hover:bg-slate-50 dark:hover:bg-navy-600 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:ring-offset-2 text-center transition-colors"
            >
              Back to Login
            </Link>

            <p className="mt-6 text-center text-sm text-slate-500 dark:text-navy-400">
               eVizor © {new Date().getFullYear()}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
