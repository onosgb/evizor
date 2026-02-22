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
          <h2 className="text-2xl font-semibold text-gray-900">Welcome Back</h2>
          <p className="text-gray-500 mt-2">
            Sign in to access secure virtual healthcare services.
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

          {/* Password */}
          <div>
            <label htmlFor="inputPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="inputPassword"
                className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Remember me + Forgot password */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="rounded text-blue-600 focus:ring-blue-600 border-gray-300"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className="text-gray-600">Remember me</span>
            </label>
            <Link href="/forgot-password" className="text-blue-600 hover:underline">
              Forgot password?
            </Link>
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
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 border-t border-gray-200" />

        {/* Footer links */}
        <p className="text-center text-sm text-gray-600">
          <Link href="/landing" className="text-blue-600 font-medium hover:underline">
            ← Back to Home
          </Link>
        </p>
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
