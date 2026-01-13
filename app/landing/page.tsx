"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "../stores/authStore";

export default function LandingPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    // Redirect to dashboard if already authenticated
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-navy-900">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-slate-600 dark:text-navy-300">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if authenticated (will redirect)
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-navy-900 dark:via-navy-800 dark:to-navy-900">
      {/* Header */}
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Image
              src="/images/evizor_icon.png"
              alt="eVizor"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <span className="text-2xl font-bold text-slate-800 dark:text-navy-50">
              eVizor
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="px-4 py-2 text-slate-700 dark:text-navy-200 hover:text-primary dark:hover:text-accent-light transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-focus dark:bg-accent dark:hover:bg-accent-focus transition-colors"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-navy-50 mb-6">
            Connecting Patients and Doctors
            <span className="block text-primary dark:text-accent-light mt-2">
              Instantly
            </span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-navy-300 mb-8 max-w-2xl mx-auto">
            eVizor is a secure virtual healthcare platform that enables patients
            to consult licensed doctors remotely via video, chat, and digital
            prescriptions.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-focus dark:bg-accent dark:hover:bg-accent-focus transition-colors shadow-lg"
            >
              Get Started
            </Link>
            <Link
              href="#features"
              className="px-8 py-3 bg-white dark:bg-navy-700 text-slate-700 dark:text-navy-200 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-navy-600 transition-colors border border-slate-200 dark:border-navy-600"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="mt-20 lg:mt-32">
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-navy-50 mb-12">
            Why Choose eVizor?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-navy-700 rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600 dark:text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-navy-50 mb-2">
                Secure & Private
              </h3>
              <p className="text-slate-600 dark:text-navy-300">
                Your health information is encrypted and protected with
                industry-standard security measures.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-navy-700 rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-600 dark:text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-navy-50 mb-2">
                24/7 Availability
              </h3>
              <p className="text-slate-600 dark:text-navy-300">
                Access healthcare services anytime, anywhere. No need to wait
                for appointments.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-navy-700 rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-purple-600 dark:text-purple-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-navy-50 mb-2">
                Expert Doctors
              </h3>
              <p className="text-slate-600 dark:text-navy-300">
                Consult with licensed healthcare professionals from the comfort
                of your home.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 lg:mt-32 text-center">
          <div className="bg-gradient-to-r from-primary to-accent dark:from-blue-600 dark:to-green-600 rounded-2xl p-8 lg:p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg mb-8 opacity-90">
              Join thousands of patients and doctors using eVizor today.
            </p>
            <Link
              href="/login"
              className="inline-block px-8 py-3 bg-white text-primary rounded-lg font-medium hover:bg-slate-50 transition-colors shadow-lg"
            >
              Sign Up Now
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20 border-t border-slate-200 dark:border-navy-700">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <Image
              src="/images/evizor_icon.png"
              alt="eVizor"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="text-lg font-semibold text-slate-800 dark:text-navy-50">
              eVizor
            </span>
          </div>
          <p className="text-sm text-slate-600 dark:text-navy-300">
            © {new Date().getFullYear()} eVizor. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
