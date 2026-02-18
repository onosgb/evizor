"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "../lib/services";
import { ApiError, LoginResponse } from "../models";
import { useAuthStore } from "../stores/authStore";

import TwoFactorModal from "./_components/TwoFactorModal";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [twoFactorAuth, setTwoFactorAuth] = useState<{
    isOpen: boolean;
    email: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Call login API
      const response = await authService.login(email, password);

      if (response.status && response.data) {
        const { user, accessToken, refreshToken } = response.data;
        console.log(user);

        // Check for 2FA
        if (user.isTwoFAEnabled && !accessToken) {
          setTwoFactorAuth({ isOpen: true, email: email });
          setIsLoading(false);
          return;
        }

        // Standard login (if tokens are present)
        if (accessToken && refreshToken) {
          login(
            accessToken,
            refreshToken,
            user,
            response.data.profileCompleted,
            rememberMe,
          );
          // Redirect to dashboard
          router.push("/");
        } else if (!user.isTwoFAEnabled) {
          // Should not happen if backend logic is correct, but transparency
          setError("Login failed. Missing access token.");
        }
      } else {
        setError(response.message || "Login failed. Please try again.");
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message || "Login failed. Please check your credentials.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      console.error("Login error:", err);
    } finally {
      // Only stop loading if we are NOT showing the 2FA modal (because modal handles its own loading/state)
      // Actually, we stopped loading above if showing 2FA.
      if (!twoFactorAuth) {
        setIsLoading(false);
      }
    }
  };

  const handle2FASuccess = (response: LoginResponse) => {
    const { user, accessToken, refreshToken, profileCompleted } = response.data;
    if (accessToken && refreshToken) {
      login(accessToken, refreshToken, user, profileCompleted, rememberMe);
      setTwoFactorAuth(null);
      router.push("/");
    } else {
      setError("Verification successful but no tokens received.");
      setTwoFactorAuth(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-navy-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <form className="form-signin" onSubmit={handleSubmit}>
          <div className="text-center mb-8">
            <Image
              src="/images/evizor_icon.png"
              alt="eVizor"
              width={90}
              height={90}
              className="mx-auto mb-4"
            />
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-navy-50 mb-2">
              Welcome Back
            </h2>
            <p className="text-slate-600 dark:text-navy-300">
              Welcome back! Please enter your details
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

            <div className="form-label-group relative">
              <input
                type={showPassword ? "text" : "password"}
                id="inputPassword"
                className="form-control w-full px-4 py-3 pr-12 rounded-lg border border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-700 text-slate-800 dark:text-navy-100 placeholder-slate-400 dark:placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:text-navy-400 dark:hover:text-navy-200 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
              <div className="flex justify-between items-center mt-2">
                <label
                  htmlFor="inputPassword"
                  className="block text-sm font-medium text-slate-700 dark:text-navy-200"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-primary hover:text-primary-focus dark:text-accent-light dark:hover:text-accent"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded dark:border-navy-600 dark:bg-navy-700"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-slate-700 dark:text-navy-200"
              >
                Remember me
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
              {isLoading ? "Signing in..." : "Sign In"}
            </button>

            <Link
              href="/"
              className="block w-full py-3 px-4 rounded-lg border border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-700 text-slate-800 dark:text-navy-100 font-medium hover:bg-slate-50 dark:hover:bg-navy-600 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:ring-offset-2 text-center transition-colors"
            >
              Back to Home Page
            </Link>

            <p className="mt-6 text-center text-sm text-slate-500 dark:text-navy-400">
              eVizor © {new Date().getFullYear()}
            </p>
          </div>
        </form>
      </div>

      {twoFactorAuth && (
        <TwoFactorModal
          isOpen={twoFactorAuth.isOpen}
          email={twoFactorAuth.email}
          onSuccess={handle2FASuccess}
          onCancel={() => setTwoFactorAuth(null)}
        />
      )}
    </div>
  );
}
