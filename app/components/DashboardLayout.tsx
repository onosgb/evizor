"use client";

import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function DashboardLayout({
  children,
  theme = "doctor",
}: {
  children: React.ReactNode;
  theme?: "admin" | "doctor";
}) {
  // Initialize sidebar state - always start with false to avoid hydration mismatch
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [monochromeMode, setMonochromeMode] = useState(false);
  const [profilePopperOpen, setProfilePopperOpen] = useState(false);

  useEffect(() => {
    // Dark mode is disabled — ensure the class is never applied
    document.documentElement.classList.remove("dark");
    localStorage.removeItem("_x_darkMode_on");

    // Check for monochrome mode preference
    const isMono = localStorage.getItem("_x_monochrome_on") === "true";
    setMonochromeMode(isMono);
    if (isMono) {
      document.documentElement.classList.add("monochrome");
    }

    // Set initial sidebar state based on screen size (only on client)
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        // Desktop: sidebar should be expanded
        setSidebarExpanded(true);
      } else {
        // Mobile: sidebar should be closed
        setSidebarExpanded(false);
      }
    };

    // Set initial state on mount
    handleResize();

    // Listen for resize events
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const toggleDarkMode = () => {};

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

  return (
    <div
      className={`min-h-screen flex grow bg-slate-50 ${
        darkMode ? "dark:bg-navy-900" : ""
      }`}
    >
      <Sidebar
        sidebarExpanded={sidebarExpanded}
        profilePopperOpen={profilePopperOpen}
        setProfilePopperOpen={setProfilePopperOpen}
        setSidebarExpanded={setSidebarExpanded}
        theme={theme}
      />

      {/* Mobile overlay - closes sidebar when clicked */}
      {sidebarExpanded && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 lg:hidden"
          onClick={() => setSidebarExpanded(false)}
          aria-hidden="true"
        />
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-y-auto h-screen">
        <Header
          sidebarExpanded={sidebarExpanded}
          setSidebarExpanded={setSidebarExpanded}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          monochromeMode={monochromeMode}
          toggleMonochromeMode={toggleMonochromeMode}
        />

        {/* Main Content */}
        <main className="main-content w-full px-4 sm:px-5 lg:px-10 pb-8 overflow-x-hidden lg:max-w-[94vw]">
          {children}
        </main>
      </div>
    </div>
  );
}
