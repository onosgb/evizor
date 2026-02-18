"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { authService } from "@/app/lib/services";
import { LoginResponse } from "@/app/models";

interface TwoFactorModalProps {
  isOpen: boolean;
  email: string;
  onSuccess: (response: LoginResponse) => void;
  onCancel: () => void;
}

export default function TwoFactorModal({
  isOpen,
  email,
  onSuccess,
  onCancel,
}: TwoFactorModalProps) {
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, resendTimer]);

  const handleVerify = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!token || token.length < 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.verify2FA(email, token);
      onSuccess(response);
    } catch (err: any) {
        console.error("2FA Error", err);
        setError(err.message || "Invalid verification code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    
    setIsResending(true);
    setError(null);
    setResendSuccess(null);

    try {
      await authService.resend2FA(email);
      setResendTimer(60);
      setResendSuccess("Verification code sent!");
    } catch (err: any) {
      setError(err.message || "Failed to resend code");
    } finally {
      setIsResending(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden p-4 outline-none focus:outline-none"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop - No onClick handler to prevent closing */}
      <div className="fixed inset-0 bg-slate-900/60 transition-opacity"></div>
      
      <div className="relative w-full max-w-sm transform rounded-lg bg-white shadow-lg transition-all dark:bg-navy-700">
        <div className="flex flex-col items-center p-5 text-center sm:p-6">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 dark:bg-accent/10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary dark:text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            </div>
            
            <h3 className="mb-2 text-xl font-semibold text-slate-700 dark:text-navy-100">
                Two-Factor Authentication
            </h3>
            
            <p className="mb-6 text-slate-500 dark:text-navy-300">
                Enter the 6-digit verification code sent to <br/>
                <span className="font-medium text-slate-700 dark:text-navy-100">{email}</span>
            </p>

            <form onSubmit={handleVerify} className="w-full space-y-4">
                <input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                    placeholder="Enter 6-digit code"
                    className="form-input w-full rounded-lg border border-slate-300 bg-transparent px-4 py-3 text-center text-lg tracking-widest placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                    autoFocus
                />
                
                {error && <p className="text-sm text-error">{error}</p>}
                {resendSuccess && <p className="text-sm text-success">{resendSuccess}</p>}

                <button
                    type="submit"
                    disabled={isLoading || token.length < 6}
                    className="btn w-full rounded-lg bg-primary py-3 font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                         <div className="flex items-center justify-center space-x-2">
                             <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                             <span>Verifying...</span>
                         </div>
                    ) : "Verify"}
                </button>
            </form>

            <div className="mt-6 flex flex-col space-y-3 w-full">
                <button
                    onClick={handleResend}
                    disabled={resendTimer > 0 || isResending}
                    className="text-sm font-medium text-primary hover:text-primary-focus dark:text-accent-light dark:hover:text-accent disabled:text-slate-400 dark:disabled:text-navy-300"
                >
                    {isResending ? "Sending..." : resendTimer > 0 ? `Resend code in ${resendTimer}s` : "Resend Code"}
                </button>

                <button
                    onClick={onCancel}
                    className="text-sm text-slate-500 hover:text-slate-700 dark:text-navy-300 dark:hover:text-navy-100"
                >
                    Cancel / Login with different account
                </button>
            </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
