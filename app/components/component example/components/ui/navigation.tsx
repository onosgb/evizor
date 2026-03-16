"use client";
import React, { useState, useEffect } from "react";
import { userStore } from "@/store/user.store";
import Sidebar from "@/components/ui/sidebar";
import Header from "@/components/ui/header";
import { Menu } from "lucide-react";

/**
 * Unified Navigation Component
 * Always shows Header at top
 * Shows Sidebar below header when user is logged in
 */
export default function Navigation() {
  const { data: user } = userStore();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [profilePopperOpen, setProfilePopperOpen] = useState(false);

  // Set sidebar expanded by default on desktop
  useEffect(() => {
    const checkDesktop = () => {
      if (window.innerWidth >= 1024) {
        setSidebarExpanded(true);
      } else {
        setSidebarExpanded(false);
      }
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  return (
    <>
      <Header />
      {user && (
        <>
          {/* Mobile toggle button */}
          <button
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            className="lg:hidden fixed top-20 left-4 z-50 bg-green-600 text-white p-2 rounded-md shadow-lg"
          >
            <Menu className="size-5" />
          </button>
          <Sidebar
            sidebarExpanded={sidebarExpanded}
            profilePopperOpen={profilePopperOpen}
            setProfilePopperOpen={setProfilePopperOpen}
            setSidebarExpanded={setSidebarExpanded}
          />
        </>
      )}
    </>
  );
}
