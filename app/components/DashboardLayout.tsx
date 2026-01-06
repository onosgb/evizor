"use client";

import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [monochromeMode, setMonochromeMode] = useState(false);
  const [profilePopperOpen, setProfilePopperOpen] = useState(false);

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
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
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
