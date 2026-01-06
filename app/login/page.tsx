"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
// import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  // const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login API call
    setTimeout(() => {
      // Store auth state
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userEmail", email);
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      }
      // login();
      setIsLoading(false);
      router.push("/");
    }, 500);
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

            <div className="form-label-group">
              <input
                type="password"
                id="inputPassword"
                className="form-control w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-700 text-slate-800 dark:text-navy-100 placeholder-slate-400 dark:placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label
                htmlFor="inputPassword"
                className="block mt-2 text-sm font-medium text-slate-700 dark:text-navy-200"
              >
                Password
              </label>
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
    </div>
  );
}
