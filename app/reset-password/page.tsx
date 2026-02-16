"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "../lib/services";
import { useToast } from "../contexts/ToastContext";
import { ApiError } from "../models";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const { showToast } = useToast();

  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (!email) {
      router.push("/forgot-password");
    }
  }, [email, router]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timerSeconds > 0) {
      timer = setTimeout(() => setTimerSeconds((prev) => prev - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [timerSeconds]);

  const handleResend = async () => {
    if (!email) return;
    
    setIsResending(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      await authService.resendPasswordReset(email);
      showToast("Code resent successfully!", "success");
      setTimerSeconds(60);
      setCanResend(false);
    } catch (err) {
       if (err instanceof ApiError) {
        setError(err.message || "Failed to resend code.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!email) {
      setError("Email is missing");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (otpCode.length !== 6) {
        setError("Please enter a valid 6-digit code");
        return;
    }

    setIsLoading(true);

    try {
      await authService.resetPassword(email, otpCode, newPassword);
      // Show success message and redirect
      showToast("Password reset successfully! Redirecting to login...", "success");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message || "Failed to reset password.");
      } else {
        setError("An unexpected error occurred.");
      }
      console.error("Reset password error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!email) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-navy-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <form className="form-signin" onSubmit={handleSubmit}>
          <div className="text-center mb-8">
            <div className="mx-auto h-20 w-20 bg-green-50 rounded-full flex items-center justify-center mb-4">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
               </svg>
            </div>
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-navy-50 mb-2">
              Reset Password
            </h2>
            <p className="text-slate-600 dark:text-navy-300">
              We've sent a verification code to {email}. Enter the code and your new password.
            </p>
          </div>

          <div className="space-y-4">
             {/* OTP Input */}
            <div className="form-label-group">
                <div className="flex justify-between items-center mb-2">
                    <label htmlFor="otpCode" className="text-sm font-medium text-slate-700 dark:text-navy-200">
                        Verification Code
                    </label>
                    {canResend ? (
                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={isResending}
                            className="text-sm text-primary hover:text-primary-focus font-medium"
                        >
                            {isResending ? "Sending..." : "Resend Code"}
                        </button>
                    ) : (
                        <span className="text-sm text-slate-400">Resend in {timerSeconds}s</span>
                    )}
                </div>
              <input
                type="text"
                id="otpCode"
                className="form-control w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-700 text-slate-800 dark:text-navy-100 placeholder-slate-400 dark:placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent tracking-widest text-center text-lg"
                placeholder="******"
                required
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
              />
            </div>

             {/* New Password */}
            <div className="form-label-group relative">
              <input
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                className="form-control w-full px-4 py-3 pr-12 rounded-lg border border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-700 text-slate-800 dark:text-navy-100 placeholder-slate-400 dark:placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent"
                placeholder="New Password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:text-navy-400 dark:hover:text-navy-200 focus:outline-none"
              >
                {showNewPassword ? (
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                     <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                   </svg>
                ) : (
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                     <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                     <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                   </svg>
                )}
              </button>
              <label htmlFor="newPassword" className="block mt-2 text-sm font-medium text-slate-700 dark:text-navy-200">New Password</label>
            </div>

            {/* Confirm Password */}
            <div className="form-label-group relative">
               <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                className="form-control w-full px-4 py-3 pr-12 rounded-lg border border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-700 text-slate-800 dark:text-navy-100 placeholder-slate-400 dark:placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent"
                placeholder="Confirm Password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:text-navy-400 dark:hover:text-navy-200 focus:outline-none"
              >
                {showConfirmPassword ? (
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                     <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                   </svg>
                ) : (
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                     <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                     <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                   </svg>
                )}
              </button>
               <label htmlFor="confirmPassword" className="block mt-2 text-sm font-medium text-slate-700 dark:text-navy-200">Confirm Password</label>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 mb-4">
                <p className="text-sm text-red-800 dark:text-red-200">
                  {error}
                </p>
              </div>
            )}
            
            {/* Removed inline success message in favor of toast */}

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-lg btn-primary1 btn-block w-full py-3 px-4 rounded-lg bg-primary text-white font-medium hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:bg-accent dark:hover:bg-accent-focus disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Resetting..." : "Reset Password"}
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
