"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
// import { useAuth } from "../contexts/AuthContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [monochromeMode, setMonochromeMode] = useState(false);
  const [searchbarActive, setSearchbarActive] = useState(false);
  const [searchPopperOpen, setSearchPopperOpen] = useState(false);
  const [notificationPopperOpen, setNotificationPopperOpen] = useState(false);
  const [profilePopperOpen, setProfilePopperOpen] = useState(false);
  const [notificationTab, setNotificationTab] = useState("tabAll");
  const [rightSidebarExpanded, setRightSidebarExpanded] = useState(false);
  const [searchInputWidth, setSearchInputWidth] = useState("w-60");
  const pathname = usePathname();
  const searchPopperRef = useRef<HTMLDivElement>(null);
  const notificationPopperRef = useRef<HTMLDivElement>(null);
  const profilePopperRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  // const { logout } = useAuth();

  useEffect(() => {
    // Check for dark mode preference
    const isDark = localStorage.getItem("_x_darkMode_on") === "true";
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    }

    // Check for monochrome mode preference
    const isMono = localStorage.getItem("_x_monochrome_on") === "true";
    setMonochromeMode(isMono);
    if (isMono) {
      document.documentElement.classList.add("monochrome");
    }
  }, []);

  useEffect(() => {
    // Close poppers when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchPopperRef.current &&
        !searchPopperRef.current.contains(event.target as Node)
      ) {
        setSearchPopperOpen(false);
      }
      if (
        notificationPopperRef.current &&
        !notificationPopperRef.current.contains(event.target as Node)
      ) {
        setNotificationPopperOpen(false);
      }
      if (
        profilePopperRef.current &&
        !profilePopperRef.current.contains(event.target as Node)
      ) {
        setProfilePopperOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchPopperOpen) {
      setSearchInputWidth("w-80");
    } else {
      setSearchInputWidth("w-60");
    }
  }, [searchPopperOpen]);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("_x_darkMode_on", String(newDarkMode));
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const toggleMonochromeMode = () => {
    const newMonochromeMode = !monochromeMode;
    setMonochromeMode(newMonochromeMode);
    localStorage.setItem("_x_monochrome_on", String(newMonochromeMode));
    if (newMonochromeMode) {
      document.documentElement.classList.add("monochrome");
    } else {
      document.documentElement.classList.remove("monochrome");
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <div
      className={`min-h-screen flex grow bg-slate-50 ${
        darkMode ? "dark:bg-navy-900" : ""
      }`}
    >
      {/* Sidebar */}
      <div
        className={`sidebar print:hidden ${sidebarExpanded ? "" : "collapsed"}`}
      >
        <div className="main-sidebar">
          <div className="flex h-full w-full flex-col items-center border-r border-slate-150 bg-blue1 dark:border-navy-700 dark:bg-navy-800">
            {/* Application Logo */}
            <div className="flex pt-4">
              <Link href="/">
                <Image
                  className="size-11 transition-transform duration-500 ease-in-out"
                  src="/images/evizor_logo_w.svg"
                  alt="eVizor logo"
                  width={44}
                  height={44}
                />
              </Link>
            </div>

            {/* Main Sections Links */}
            <div className="is-scrollbar-hidden flex grow flex-col space-y-4 overflow-y-auto pt-6">
              {/* Dashboard */}
              <Link
                href="/"
                className={`flex size-11 items-center justify-center rounded-lg text-white outline-hidden transition-colors duration-200 hover:bg-white/20 focus:bg-white/20 active:bg-white/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 ${
                  isActive("/")
                    ? "bg-primary/10 dark:bg-navy-600 dark:text-accent-light"
                    : ""
                }`}
                title="Dashboard"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-8"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    fillOpacity=".25"
                    d="M5 14.059c0-1.01 0-1.514.222-1.945c.221-.43.632-.724 1.453-1.31l4.163-2.974c.56-.4.842-.601 1.162-.601c.32 0 .601.2 1.162.601l4.163 2.973c.821.587 1.232.88 1.453 1.311c.222.43.222.935.222 1.944V19c0 .943 0 1.414-.293 1.707C18.414 21 17.943 21 17 21H7c-.943 0-1.414 0-1.707-.293C5 20.414 5 19.943 5 19z"
                  />
                  <path
                    fill="currentColor"
                    d="M3 12.387c0 .266 0 .4.084.441c.084.041.19-.04.4-.205l7.288-5.668c.59-.459.885-.688 1.228-.688c.343 0 .638.23 1.228.688l7.288 5.668c.21.164.316.246.4.205c.084-.041.084-.175.084-.441v-.409c0-.48 0-.72-.102-.928c-.101-.208-.291-.356-.67-.65l-7-5.445c-.59-.459-.885-.688-1.228-.688c-.343 0-.638.23-1.228.688l-7 5.445c-.379.294-.569.442-.67.65c-.102.208-.102.448-.102.928zM12.5 15h-1a2 2 0 0 0-2 2v3.85c0 .083.067.15.15.15h4.7a.15.15 0 0 0 .15-.15V17a2 2 0 0 0-2-2"
                  />
                  <rect
                    width="2"
                    height="4"
                    x="16"
                    y="5"
                    fill="currentColor"
                    rx=".5"
                  />
                </svg>
              </Link>

              {/* Live Queue */}
              <Link
                href="/live-queue"
                className={`flex size-11 items-center justify-center rounded-lg text-white outline-hidden transition-colors duration-200 hover:bg-white/20 focus:bg-white/20 active:bg-white/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 ${
                  isActive("/live-queue")
                    ? "bg-primary/10 dark:bg-navy-600 dark:text-accent-light"
                    : ""
                }`}
                title="Live Queue"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-8"
                  viewBox="0 0 24 24"
                >
                  <g fill="none" stroke="currentColor" strokeWidth="1.2">
                    <circle
                      cx="12"
                      cy="13"
                      r="7"
                      fill="currentColor"
                      fillOpacity=".25"
                    />
                    <path
                      strokeLinecap="round"
                      d="M5 5L3 7m16-2l2 2M9 11l2.81 1.873a.25.25 0 0 0 .333-.052L14 10.5"
                    />
                  </g>
                </svg>
              </Link>

              {/* Assigned Cases */}
              <Link
                href="/assigned-cases"
                className={`flex size-11 items-center justify-center rounded-lg text-white outline-hidden transition-colors duration-200 hover:bg-white/20 focus:bg-white/20 active:bg-white/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 ${
                  isActive("/assigned-cases")
                    ? "bg-primary/10 dark:bg-navy-600 dark:text-accent-light"
                    : ""
                }`}
                title="Assigned Cases"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-8"
                  viewBox="0 0 24 24"
                >
                  <rect
                    width="12"
                    height="10"
                    x="6"
                    y="3"
                    fill="currentColor"
                    fillOpacity=".25"
                    rx="2"
                  />
                  <path
                    fill="currentColor"
                    d="M3 10h14.8c1.12 0 1.68 0 2.108.218a2 2 0 0 1 .874.874C21 11.52 21 12.08 21 13.2v4.6c0 1.12 0 1.68-.218 2.108a2 2 0 0 1-.874.874C19.48 21 18.92 21 17.8 21H6.2c-1.12 0-1.68 0-2.108-.218a2 2 0 0 1-.874-.874C3 19.48 3 18.92 3 17.8zm0 0c0-.932 0-1.398.152-1.765a2 2 0 0 1 1.083-1.083C4.602 7 5.068 7 6 7h2.343c.818 0 1.226 0 1.594.152c.368.152.657.442 1.235 1.02L13 10z"
                  />
                </svg>
              </Link>

              {/* History */}
              <Link
                href="/patient-history"
                className={`flex size-11 items-center justify-center text-white rounded-lg outline-hidden transition-colors duration-200 hover:bg-white/20 focus:bg-white/20 active:bg-white/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 ${
                  isActive("/patient-history")
                    ? "bg-primary/10 dark:bg-navy-600 dark:text-accent-light"
                    : ""
                }`}
                title="History"
              >
                <svg
                  className="size-8"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillOpacity="0.25"
                    d="M21.0001 16.05V18.75C21.0001 20.1 20.1001 21 18.7501 21H6.6001C6.9691 21 7.3471 20.946 7.6981 20.829C7.7971 20.793 7.89609 20.757 7.99509 20.712C8.31009 20.586 8.61611 20.406 8.88611 20.172C8.96711 20.109 9.05711 20.028 9.13811 19.947L9.17409 19.911L15.2941 13.8H18.7501C20.1001 13.8 21.0001 14.7 21.0001 16.05Z"
                    fill="currentColor"
                  />
                  <path
                    fillOpacity="0.5"
                    d="M17.7324 11.361L15.2934 13.8L9.17334 19.9111C9.80333 19.2631 10.1993 18.372 10.1993 17.4V8.70601L12.6384 6.26701C13.5924 5.31301 14.8704 5.31301 15.8244 6.26701L17.7324 8.17501C18.6864 9.12901 18.6864 10.407 17.7324 11.361Z"
                    fill="currentColor"
                  />
                  <path
                    d="M7.95 3H5.25C3.9 3 3 3.9 3 5.25V17.4C3 17.643 3.02699 17.886 3.07199 18.12C3.09899 18.237 3.12599 18.354 3.16199 18.471C3.20699 18.606 3.252 18.741 3.306 18.867C3.315 18.876 3.31501 18.885 3.31501 18.885C3.32401 18.885 3.32401 18.885 3.31501 18.894C3.44101 19.146 3.585 19.389 3.756 19.614C3.855 19.731 3.95401 19.839 4.05301 19.947C4.15201 20.055 4.26 20.145 4.377 20.235L4.38601 20.244C4.61101 20.415 4.854 20.559 5.106 20.685C5.115 20.676 5.11501 20.676 5.11501 20.685C5.25001 20.748 5.385 20.793 5.529 20.838C5.646 20.874 5.76301 20.901 5.88001 20.928C6.11401 20.973 6.357 21 6.6 21C6.969 21 7.347 20.946 7.698 20.829C7.797 20.793 7.89599 20.757 7.99499 20.712C8.30999 20.586 8.61601 20.406 8.88601 20.172C8.96701 20.109 9.05701 20.028 9.13801 19.947L9.17399 19.911C9.80399 19.263 10.2 18.372 10.2 17.4V5.25C10.2 3.9 9.3 3 7.95 3ZM6.6 18.75C5.853 18.75 5.25 18.147 5.25 17.4C5.25 16.653 5.853 16.05 6.6 16.05C7.347 16.05 7.95 16.653 7.95 17.4C7.95 18.147 7.347 18.75 6.6 18.75Z"
                    fill="currentColor"
                  />
                </svg>
              </Link>
            </div>

            {/* Bottom Links */}
            <div className="flex flex-col items-center space-y-3 py-3">
              {/* Settings */}
              <Link
                href="/settings"
                className="flex size-11 items-center justify-center text-white rounded-lg outline-hidden transition-colors duration-200 hover:bg-white/20 focus:bg-white/20 active:bg-white/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
                title="Settings"
              >
                <svg
                  className="size-7"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillOpacity="0.4"
                    fill="currentColor"
                    d="M2 12.947v-1.771c0-1.047.85-1.913 1.899-1.913 1.81 0 2.549-1.288 1.64-2.868a1.919 1.919 0 0 1 .699-2.607l1.729-.996c.79-.474 1.81-.192 2.279.603l.11.192c.9 1.58 2.379 1.58 3.288 0l.11-.192c.47-.795 1.49-1.077 2.279-.603l1.73.996a1.92 1.92 0 0 1 .699 2.607c-.91 1.58-.17 2.868 1.639 2.868 1.04 0 1.899.856 1.899 1.912v1.772c0 1.047-.85 1.912-1.9 1.912-1.808 0-2.548 1.288-1.638 2.869.52.915.21 2.083-.7 2.606l-1.729.997c-.79.473-1.81.191-2.279-.604l-.11-.191c-.9-1.58-2.379-1.58-3.288 0l-.11.19c-.47.796-1.49 1.078-2.279.605l-1.73-.997a1.919 1.919 0 0 1-.699-2.606c.91-1.58.17-2.869-1.639-2.869A1.911 1.911 0 0 1 2 12.947Z"
                  />
                  <path
                    fill="currentColor"
                    d="M11.995 15.332c1.794 0 3.248-1.464 3.248-3.27 0-1.807-1.454-3.272-3.248-3.272-1.794 0-3.248 1.465-3.248 3.271 0 1.807 1.454 3.271 3.248 3.271Z"
                  />
                </svg>
              </Link>

              {/* Profile */}
              <div className="flex relative" ref={profilePopperRef}>
                <button
                  onClick={() => setProfilePopperOpen(!profilePopperOpen)}
                  className="avatar size-12 cursor-pointer"
                >
                  <Image
                    className="rounded-full"
                    src="/images/200x200.png"
                    alt="avatar"
                    width={48}
                    height={48}
                  />
                  <span className="absolute right-0 size-3.5 rounded-full border-2 border-white bg-success dark:border-navy-700"></span>
                </button>

                {profilePopperOpen && (
                  <div className="popper-root fixed show">
                    <div className="popper-box w-64 rounded-lg border border-slate-150 bg-white shadow-soft dark:border-navy-600 dark:bg-navy-700">
                      <div className="flex items-center space-x-4 rounded-t-lg bg-slate-100 py-5 px-4 dark:bg-navy-800">
                        <div className="avatar size-14">
                          <Image
                            className="rounded-full"
                            src="/images/200x200.png"
                            alt="avatar"
                            width={56}
                            height={56}
                          />
                        </div>
                        <div>
                          <Link
                            href="#"
                            className="text-base font-medium text-slate-700 hover:text-primary focus:text-primary dark:text-navy-100 dark:hover:text-accent-light dark:focus:text-accent-light"
                          >
                            Travis Fuller
                          </Link>
                          <p className="text-xs text-slate-400 dark:text-navy-300">
                            Product Designer
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col pt-2 pb-5">
                        <Link
                          href="#"
                          className="group flex items-center space-x-3 py-2 px-4 tracking-wide outline-hidden transition-all hover:bg-slate-100 focus:bg-slate-100 dark:hover:bg-navy-600 dark:focus:bg-navy-600"
                        >
                          <div className="flex size-8 items-center justify-center rounded-lg bg-warning text-white">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="size-4.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          </div>
                          <div>
                            <h2 className="font-medium text-slate-700 transition-colors group-hover:text-primary group-focus:text-primary dark:text-navy-100 dark:group-hover:text-accent-light dark:group-focus:text-accent-light">
                              Profile
                            </h2>
                            <div className="text-xs text-slate-400 line-clamp-1 dark:text-navy-300">
                              Your profile setting
                            </div>
                          </div>
                        </Link>
                        <Link
                          href="#"
                          className="group flex items-center space-x-3 py-2 px-4 tracking-wide outline-hidden transition-all hover:bg-slate-100 focus:bg-slate-100 dark:hover:bg-navy-600 dark:focus:bg-navy-600"
                        >
                          <div className="flex size-8 items-center justify-center rounded-lg bg-info text-white">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="size-4.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                              />
                            </svg>
                          </div>
                          <div>
                            <h2 className="font-medium text-slate-700 transition-colors group-hover:text-primary group-focus:text-primary dark:text-navy-100 dark:group-hover:text-accent-light dark:group-focus:text-accent-light">
                              Messages
                            </h2>
                            <div className="text-xs text-slate-400 line-clamp-1 dark:text-navy-300">
                              Your messages and tasks
                            </div>
                          </div>
                        </Link>
                        <Link
                          href="#"
                          className="group flex items-center space-x-3 py-2 px-4 tracking-wide outline-hidden transition-all hover:bg-slate-100 focus:bg-slate-100 dark:hover:bg-navy-600 dark:focus:bg-navy-600"
                        >
                          <div className="flex size-8 items-center justify-center rounded-lg bg-secondary text-white">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="size-4.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                              />
                            </svg>
                          </div>
                          <div>
                            <h2 className="font-medium text-slate-700 transition-colors group-hover:text-primary group-focus:text-primary dark:text-navy-100 dark:group-hover:text-accent-light dark:group-focus:text-accent-light">
                              Team
                            </h2>
                            <div className="text-xs text-slate-400 line-clamp-1 dark:text-navy-300">
                              Your team activity
                            </div>
                          </div>
                        </Link>
                        <Link
                          href="#"
                          className="group flex items-center space-x-3 py-2 px-4 tracking-wide outline-hidden transition-all hover:bg-slate-100 focus:bg-slate-100 dark:hover:bg-navy-600 dark:focus:bg-navy-600"
                        >
                          <div className="flex size-8 items-center justify-center rounded-lg bg-error text-white">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="size-4.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          </div>
                          <div>
                            <h2 className="font-medium text-slate-700 transition-colors group-hover:text-primary group-focus:text-primary dark:text-navy-100 dark:group-hover:text-accent-light dark:group-focus:text-accent-light">
                              Activity
                            </h2>
                            <div className="text-xs text-slate-400 line-clamp-1 dark:text-navy-300">
                              Your activity and events
                            </div>
                          </div>
                        </Link>
                        <Link
                          href="#"
                          className="group flex items-center space-x-3 py-2 px-4 tracking-wide outline-hidden transition-all hover:bg-slate-100 focus:bg-slate-100 dark:hover:bg-navy-600 dark:focus:bg-navy-600"
                        >
                          <div className="flex size-8 items-center justify-center rounded-lg bg-success text-white">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="size-4.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                          </div>
                          <div>
                            <h2 className="font-medium text-slate-700 transition-colors group-hover:text-primary group-focus:text-primary dark:text-navy-100 dark:group-hover:text-accent-light dark:group-focus:text-accent-light">
                              Settings
                            </h2>
                            <div className="text-xs text-slate-400 line-clamp-1 dark:text-navy-300">
                              Webapp settings
                            </div>
                          </div>
                        </Link>
                        {/* <div className="mt-3 px-4">
                          <button
                            onClick={logout}
                            className="btn h-9 w-full space-x-2 bg-primary text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="size-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.5"
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                              />
                            </svg>
                            <span>Logout</span>
                          </button>
                        </div> */}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* App Header */}
        <nav className="header bg-white dark:bg-navy-750 before:bg-white dark:before:bg-navy-750 print:hidden">
          <div className="header-container relative flex w-full px-4 sm:px-5 lg:px-6 print:hidden">
            <div className="flex w-full items-center justify-between">
              {/* Left: Sidebar Toggle Button */}
              <div className="size-7">
                <button
                  className={`menu-toggle cursor-pointer ml-0.5 flex size-7 flex-col justify-center space-y-1.5 text-primary outline-hidden focus:outline-hidden dark:text-accent-light/80 ${
                    sidebarExpanded ? "active" : ""
                  }`}
                  onClick={() => setSidebarExpanded(!sidebarExpanded)}
                >
                  <span></span>
                  <span></span>
                  <span></span>
                </button>
              </div>

              {/* Right: Header buttons */}
              <div className="-mr-1.5 flex items-center space-x-2">
                {/* Mobile Search Toggle */}
                <button
                  onClick={() => setSearchbarActive(!searchbarActive)}
                  className="btn size-8 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 sm:hidden"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-5.5 text-slate-500 dark:text-navy-100"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>

                {/* Main Searchbar - Desktop */}
                <div className="hidden sm:flex relative" ref={searchPopperRef}>
                  <div className="relative mr-4 flex h-8">
                    <input
                      ref={searchInputRef}
                      placeholder="Search here..."
                      className={`form-input peer h-full rounded-full bg-slate-150 px-4 pl-9 text-xs-plus text-slate-800 ring-primary/50 hover:bg-slate-200 focus:ring-3 dark:bg-navy-900/90 dark:text-navy-100 dark:placeholder-navy-300 dark:ring-accent/50 dark:hover:bg-navy-900 dark:focus:bg-navy-900 transition-all duration-200 ${searchInputWidth}`}
                      onFocus={() => setSearchPopperOpen(true)}
                      type="text"
                    />
                    <div className="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-4.5 transition-colors duration-200"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M3.316 13.781l.73-.171-.73.171zm0-5.457l.73.171-.73-.171zm15.473 0l.73-.171-.73.171zm0 5.457l.73.171-.73-.171zm-5.008 5.008l-.171-.73.171.73zm-5.457 0l-.171.73.171-.73zm0-15.473l-.171-.73.171.73zm5.457 0l.171-.73-.171.73zM20.47 21.53a.75.75 0 101.06-1.06l-1.06 1.06zM4.046 13.61a11.198 11.198 0 010-5.115l-1.46-.342a12.698 12.698 0 000 5.8l1.46-.343zm14.013-5.115a11.196 11.196 0 010 5.115l1.46.342a12.698 12.698 0 000-5.8l-1.46.343zm-4.45 9.564a11.196 11.196 0 01-5.114 0l-.342 1.46c1.907.448 3.892.448 5.8 0l-.343-1.46zM8.496 4.046a11.198 11.198 0 015.115 0l.342-1.46a12.698 12.698 0 00-5.8 0l.343 1.46zm0 14.013a5.97 5.97 0 01-4.45-4.45l-1.46.343a7.47 7.47 0 005.568 5.568l.342-1.46zm5.457 1.46a7.47 7.47 0 005.568-5.567l-1.46-.342a5.97 5.97 0 01-4.45 4.45l.342 1.46zM13.61 4.046a5.97 5.97 0 014.45 4.45l1.46-.343a7.47 7.47 0 00-5.568-5.567l-.342 1.46zm-5.457-1.46a7.47 7.47 0 00-5.567 5.567l1.46.342a5.97 5.97 0 014.45-4.45l-.343-1.46zm8.652 15.28l3.665 3.664 1.06-1.06-3.665-3.665-1.06 1.06z" />
                      </svg>
                    </div>
                  </div>
                  {searchPopperOpen && (
                    <div className="popper-root show">
                      <div className="popper-box flex max-h-[calc(100vh-6rem)] w-80 flex-col rounded-lg border border-slate-150 bg-white shadow-soft dark:border-navy-800 dark:bg-navy-700 dark:shadow-soft-dark">
                        <div className="is-scrollbar-hidden flex shrink-0 overflow-x-auto rounded-t-lg bg-slate-100 px-2 text-slate-600 dark:bg-navy-800 dark:text-navy-200">
                          {[
                            "All",
                            "Files",
                            "Chats",
                            "Emails",
                            "Projects",
                            "Tasks",
                          ].map((tab) => (
                            <button
                              key={tab}
                              className="btn shrink-0 rounded-none border-b-2 px-3.5 py-2.5 border-transparent hover:text-slate-800 focus:text-slate-800 dark:hover:text-navy-100 dark:focus:text-navy-100"
                            >
                              {tab}
                            </button>
                          ))}
                        </div>
                        <div className="is-scrollbar-hidden overflow-y-auto overscroll-contain pb-2">
                          <div className="is-scrollbar-hidden mt-3 flex space-x-4 overflow-x-auto px-3">
                            {/* Quick access items */}
                            {[
                              {
                                name: "Kanban",
                                icon: "M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2",
                                color: "bg-success",
                              },
                              {
                                name: "Analytics",
                                icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
                                color: "bg-secondary",
                              },
                              {
                                name: "Chat",
                                icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
                                color: "bg-info",
                              },
                            ].map((item) => (
                              <a
                                key={item.name}
                                href="#"
                                className="w-14 text-center"
                              >
                                <div className="avatar size-12">
                                  <div
                                    className={`is-initial rounded-full ${item.color} text-white`}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="size-5"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d={item.icon}
                                      />
                                    </svg>
                                  </div>
                                </div>
                                <p className="mt-1.5 overflow-hidden text-ellipsis whitespace-nowrap text-xs text-slate-700 dark:text-navy-100">
                                  {item.name}
                                </p>
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Dark Mode Toggle */}
                <button
                  onClick={toggleDarkMode}
                  className="btn size-8 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
                  title={
                    darkMode ? "Switch to light mode" : "Switch to dark mode"
                  }
                >
                  {darkMode ? (
                    <svg
                      className="size-6 text-amber-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M11.75 3.412a.818.818 0 01-.07.917 6.332 6.332 0 00-1.4 3.971c0 3.564 2.98 6.494 6.706 6.494a6.86 6.86 0 002.856-.617.818.818 0 011.1 1.047C19.593 18.614 16.218 21 12.283 21 7.18 21 3 16.973 3 11.956c0-4.563 3.46-8.31 7.925-8.948a.818.818 0 01.826.404z" />
                    </svg>
                  ) : (
                    <svg
                      className="size-6 text-amber-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>

                {/* Monochrome Mode Toggle */}
                <button
                  onClick={toggleMonochromeMode}
                  className="btn size-8 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
                  title={
                    monochromeMode
                      ? "Disable monochrome mode"
                      : "Enable monochrome mode"
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-5 text-slate-500 dark:text-navy-100"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 22C6.49 22 2 17.51 2 12S6.49 2 12 2s10 4.04 10 9c0 3.31-2.69 6-6 6h-1.77c-.28 0-.5.22-.5.5 0 .12.05.23.13.33.41.47.64 1.06.64 1.67A2.5 2.5 0 0 1 12 22zm0-18c-4.41 0-8 3.59-8 8s3.59 8 8 8c.28 0 .5-.22.5-.5a.54.54 0 0 0-.14-.35c-.41-.46-.63-1.05-.63-1.65a2.5 2.5 0 0 1 2.5-2.5H16c2.21 0 4-1.79 4-4 0-3.86-3.59-7-8-7z" />
                    <circle cx="6.5" cy="11.5" r="1.5" />
                    <circle cx="9.5" cy="7.5" r="1.5" />
                    <circle cx="14.5" cy="7.5" r="1.5" />
                    <circle cx="17.5" cy="11.5" r="1.5" />
                  </svg>
                </button>

                {/* Notification */}
                <div className="flex relative" ref={notificationPopperRef}>
                  <button
                    onClick={() =>
                      setNotificationPopperOpen(!notificationPopperOpen)
                    }
                    className="btn relative size-8 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-5 text-slate-500 dark:text-navy-100"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M15.375 17.556h-6.75m6.75 0H21l-1.58-1.562a2.254 2.254 0 01-.67-1.596v-3.51a6.612 6.612 0 00-1.238-3.85 6.744 6.744 0 00-3.262-2.437v-.379c0-.59-.237-1.154-.659-1.571A2.265 2.265 0 0012 2c-.597 0-1.169.234-1.591.65a2.208 2.208 0 00-.659 1.572v.38c-2.621.915-4.5 3.385-4.5 6.287v3.51c0 .598-.24 1.172-.67 1.595L3 17.556h12.375zm0 0v1.11c0 .885-.356 1.733-.989 2.358A3.397 3.397 0 0112 22a3.397 3.397 0 01-2.386-.976 3.313 3.313 0 01-.989-2.357v-1.111h6.75z"
                      />
                    </svg>
                    <span className="absolute -top-px -right-px flex size-3 items-center justify-center">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-80"></span>
                      <span className="inline-flex size-2 rounded-full bg-secondary"></span>
                    </span>
                  </button>
                  {notificationPopperOpen && (
                    <div className="popper-root show">
                      <div className="popper-box mx-4 mt-1 flex max-h-[calc(100vh-6rem)] w-[calc(100vw-2rem)] flex-col rounded-lg border border-slate-150 bg-white shadow-soft dark:border-navy-800 dark:bg-navy-700 dark:shadow-soft-dark sm:m-0 sm:w-80">
                        <div className="rounded-t-lg bg-slate-100 text-slate-600 dark:bg-navy-800 dark:text-navy-200">
                          <div className="flex items-center justify-between px-4 pt-2">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-medium text-slate-700 dark:text-navy-100">
                                Notifications
                              </h3>
                              <div className="badge h-5 rounded-full bg-primary/10 px-1.5 text-primary dark:bg-accent-light/15 dark:text-accent-light">
                                26
                              </div>
                            </div>
                            <button className="btn -mr-1.5 size-7 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="size-4.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="1.5"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                            </button>
                          </div>
                          <div className="is-scrollbar-hidden flex shrink-0 overflow-x-auto px-3">
                            {["All", "Alerts", "Events", "Logs"].map((tab) => (
                              <button
                                key={tab}
                                onClick={() => setNotificationTab(`tab${tab}`)}
                                className={`btn shrink-0 rounded-none border-b-2 px-3.5 py-2.5 ${
                                  notificationTab === `tab${tab}`
                                    ? "border-primary dark:border-accent text-primary dark:text-accent-light"
                                    : "border-transparent hover:text-slate-800 focus:text-slate-800 dark:hover:text-navy-100 dark:focus:text-navy-100"
                                }`}
                              >
                                <span>{tab}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="tab-content flex flex-col overflow-hidden">
                          <div className="is-scrollbar-hidden space-y-4 overflow-y-auto px-4 py-4">
                            {/* Sample notification items */}
                            <div className="flex items-center space-x-3">
                              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary/10 dark:bg-secondary-light/15">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="size-5 text-secondary dark:text-secondary-light"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                </svg>
                              </div>
                              <div>
                                <p className="font-medium text-slate-600 dark:text-navy-100">
                                  User Photo Changed
                                </p>
                                <div className="mt-1 text-xs text-slate-400 line-clamp-1 dark:text-navy-300">
                                  John Doe changed his avatar photo
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Sidebar Toggle */}
                <button
                  onClick={() => setRightSidebarExpanded(true)}
                  className="btn size-8 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-5.5 text-slate-500 dark:text-navy-100"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile Searchbar */}
        {searchbarActive && (
          <div className="fixed inset-0 z-100 flex flex-col bg-white dark:bg-navy-700 sm:hidden">
            <div className="flex items-center space-x-2 bg-slate-100 px-3 pt-2 dark:bg-navy-800">
              <button
                className="btn -ml-1.5 size-7 shrink-0 rounded-full p-0 text-slate-600 hover:bg-slate-300/20 active:bg-slate-300/25 dark:text-navy-100 dark:hover:bg-navy-300/20 dark:active:bg-navy-300/25"
                onClick={() => setSearchbarActive(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-5"
                  fill="none"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <input
                className="form-input h-8 w-full bg-transparent placeholder-slate-400 dark:placeholder-navy-300"
                type="text"
                placeholder="Search here..."
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="main-content w-full px-4 sm:px-5 lg:px-10 pb-8 overflow-x-hidden lg:max-w-[94vw]">
          {children}
        </main>
      </div>
    </div>
  );
}
