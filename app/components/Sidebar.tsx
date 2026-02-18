"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useAuthStore } from "../stores/authStore";
import { isAdmin as checkIsAdmin, isDoctor as checkIsDoctor } from "@/app/lib/roles";
import * as Tooltip from "@radix-ui/react-tooltip";
import { createPortal } from "react-dom";

interface SidebarProps {
  sidebarExpanded: boolean;
  profilePopperOpen: boolean;
  setProfilePopperOpen: (open: boolean) => void;
  setSidebarExpanded: (expanded: boolean) => void;
  theme?: "admin" | "doctor";
}

export default function Sidebar({
  sidebarExpanded,
  profilePopperOpen,
  setProfilePopperOpen,
  setSidebarExpanded,
  theme = "doctor",
}: SidebarProps) {
  const pathname = usePathname();
  const profileButtonRef = useRef<HTMLButtonElement>(null);
  const profilePopperRef = useRef<HTMLDivElement>(null);
  const user = useAuthStore((state) => state.user);
  const isAdmin = checkIsAdmin(user);
  const isDoctor = checkIsDoctor(user);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Safely get logout function from auth context
  let logout: (() => Promise<void>) | undefined;
  try {
    const auth = useAuth();
    logout = auth?.logout;
  } catch (e) {
    // Auth context not available
    logout = undefined;
  }

  const handleLogout = async () => {
    if (logout && !isLoggingOut) {
      setIsLoggingOut(true);
      try {
        await logout();
      } catch (error) {
        console.error("Logout failed:", error);
        setIsLoggingOut(false);
      }
    }
  };

  // Prevent body scroll on mobile when sidebar is open
  useEffect(() => {
    if (sidebarExpanded) {
      // Use inline style for mobile scroll prevention (Tailwind classes won't work via classList)
      document.body.style.overflow = "hidden";
      // Allow scroll on desktop
      if (window.innerWidth >= 1024) {
        document.body.style.overflow = "auto";
      }
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarExpanded]);

  // Position popper and handle click outside
  useEffect(() => {
    if (!profilePopperOpen || !profileButtonRef.current || !profilePopperRef.current) {
      return;
    }

    const updatePosition = () => {
      if (!profileButtonRef.current || !profilePopperRef.current) return;

      const buttonRect = profileButtonRef.current.getBoundingClientRect();
      const popper = profilePopperRef.current;
      const verticalOffset = -5;
      const horizontalOffset = 255; // Increased even more to prevent clipping
      
      // Get popper height - ensure it's rendered first
      const popperHeight = popper.offsetHeight || 450;
      
      // Position above the button, aligning bottom of popper with top of button (top-end placement)
      // This means: popper bottom = button top - offset
      // So: popper top = button top - popper height - offset
      const topPosition = buttonRect.top - popperHeight - verticalOffset;
      
      // Get the sidebar container to calculate its actual width
      // The sidebar has w-20 class which is 80px (5rem)
      const sidebarContainer = profileButtonRef.current.closest('[class*="w-20"], [class*="sidebar"]') as HTMLElement;
      const sidebarRect = sidebarContainer?.getBoundingClientRect();
      const sidebarRight = sidebarRect?.right || buttonRect.right;
      
      // Calculate position from the right edge of the sidebar with proper offset
      // Ensure it's well clear of the sidebar edge
      const leftPosition = sidebarRight + horizontalOffset;
      
      popper.style.position = "fixed";
      popper.style.top = `${topPosition}px`;
      popper.style.left = `${leftPosition}px`;
      popper.style.zIndex = "9999";
      popper.style.maxWidth = "none"; // Ensure no width constraints
      popper.style.overflow = "visible"; // Ensure content isn't clipped
      popper.style.pointerEvents = "auto"; // Ensure it's interactive
      
      // If popper would go off-screen at top, position it below instead
      if (topPosition < 10) {
        popper.style.top = `${buttonRect.bottom + verticalOffset}px`;
      }
    };

    // Use multiple animation frames to ensure DOM is fully rendered
    requestAnimationFrame(() => {
      requestAnimationFrame(updatePosition);
    });

    // Handle click outside
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profilePopperRef.current &&
        profileButtonRef.current &&
        !profilePopperRef.current.contains(event.target as Node) &&
        !profileButtonRef.current.contains(event.target as Node)
      ) {
        setProfilePopperOpen(false);
      }
    };

    // Handle window resize
    const handleResize = () => {
      updatePosition();
    };

    // Add event listeners
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [profilePopperOpen, setProfilePopperOpen]);

  const isActive = (path: string) => pathname === path;

  // Close sidebar on mobile when a link is clicked
  const handleLinkClick = () => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setSidebarExpanded(false);
    }
  };

  // Tooltip wrapper component
  const TooltipWrapper = ({
    text,
    children,
  }: {
    text: string;
    children: React.ReactNode;
  }) => {
    return (
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="right"
            sideOffset={8}
            className="z-9999 rounded-md bg-slate-50 dark:bg-navy-700 px-3 py-1.5 text-sm font-medium text-slate-700 shadow-lg dark:text-navy-100 border border-slate-200 dark:border-navy-600 data-[state=delayed-open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-[state=closed]:zoom-out-95"
          >
            {text}
            <Tooltip.Arrow className="fill-slate-50 dark:fill-navy-700" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    );
  };

  return (
    <Tooltip.Provider delayDuration={200}>
      <div
        className={` 
          fixed left-0 top-0 h-screen z-50
          transform transition-transform duration-300 ease-in-out
          ${sidebarExpanded ? "translate-x-0" : "-translate-x-full"}
          lg:relative lg:translate-x-0 lg:z-auto
        `}
      >
        <div className="h-full w-20 overflow-visible">
          <div
            className={`flex h-full w-full flex-col items-center border-r border-slate-150 ${
              theme === "admin" ? "bg-green1" : "bg-blue1"
            } dark:border-navy-700 dark:bg-navy-800 overflow-visible`}
          >
            {/* Application Logo */}
            <div className="flex pt-4">
              <Link href="/" onClick={handleLinkClick}>
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
              <TooltipWrapper text="Dashboard">
                <Link
                  href="/"
                  onClick={handleLinkClick}
                  className={`flex size-11 items-center justify-center rounded-lg text-white outline-hidden transition-colors duration-200 hover:bg-white/20 focus:bg-white/20 active:bg-white/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 ${
                    isActive("/")
                      ? "bg-primary/10 dark:bg-navy-600 dark:text-accent-light"
                      : ""
                  }`}
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
              </TooltipWrapper>

              {/* Live Queue - Doctor Only */}
              {isDoctor && (
                <TooltipWrapper text="Live Queue">
                  <Link
                    href="/live-queue"
                    onClick={handleLinkClick}
                    className={`flex size-11 items-center justify-center rounded-lg text-white outline-hidden transition-colors duration-200 hover:bg-white/20 focus:bg-white/20 active:bg-white/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 ${
                      isActive("/live-queue")
                        ? "bg-primary/10 dark:bg-navy-600 dark:text-accent-light"
                        : ""
                    }`}
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
                </TooltipWrapper>
              )}

              {/* Assigned Cases - Doctor Only */}
              {isDoctor && (
                <TooltipWrapper text="Assigned Cases">
                  <Link
                    href="/assigned-cases"
                    onClick={handleLinkClick}
                    className={`flex size-11 items-center justify-center rounded-lg text-white outline-hidden transition-colors duration-200 hover:bg-white/20 focus:bg-white/20 active:bg-white/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 ${
                      isActive("/assigned-cases")
                        ? "bg-primary/10 dark:bg-navy-600 dark:text-accent-light"
                        : ""
                    }`}
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
                </TooltipWrapper>
              )}

              {/* Staff Management - Admin Only */}
              {isAdmin && (
                <TooltipWrapper text="Staff Management">
                  <Link
                    href="/staff-management"
                    onClick={handleLinkClick}
                    className={`flex size-11 items-center justify-center rounded-lg text-white outline-hidden transition-colors duration-200 hover:bg-white/20 focus:bg-white/20 active:bg-white/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 ${
                      isActive("/staff-management")
                        ? "bg-primary/10 dark:bg-navy-600 dark:text-accent-light"
                        : ""
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="size-8"
                    >
                      <path
                        fill="currentColor"
                        d="M12 13c2.396 0 4.575.694 6.178 1.671.8.49 1.484 1.065 1.978 1.69.486.616.844 1.352.844 2.139 0 .845-.411 1.511-1.003 1.986-.56.45-1.299.748-2.084.956-1.578.417-3.684.558-5.913.558s-4.335-.14-5.913-.558c-.785-.208-1.524-.506-2.084-.956C3.41 20.01 3 19.345 3 18.5c0-.787.358-1.523.844-2.139.494-.625 1.177-1.2 1.978-1.69C7.425 13.694 9.605 13 12 13Z"
                        className="duoicon-primary-layer"
                      />
                      <path
                        fill="currentColor"
                        d="M12 2c3.849 0 6.255 4.167 4.33 7.5A5 5 0 0 1 12 12c-3.849 0-6.255-4.167-4.33-7.5A5 5 0 0 1 12 2Z"
                        className="duoicon-secondary-layer"
                        opacity=".3"
                      />
                    </svg>
                  </Link>
                </TooltipWrapper>
              )}

              {/* Queue Monitor - Admin Only */}

              {isAdmin && (
                <TooltipWrapper text="Queue Monitor">
                  <Link
                    href="/queue-monitor"
                    onClick={handleLinkClick}
                    className={`flex size-11 items-center justify-center rounded-lg text-white outline-hidden transition-colors duration-200 hover:bg-white/20 focus:bg-white/20 active:bg-white/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 ${
                      isActive("/queue-monitor")
                        ? "bg-primary/10 dark:bg-navy-600 dark:text-accent-light"
                        : ""
                    }`}
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
                </TooltipWrapper>
              )}

              {/* Pending Verifications - Admin Only */}
              {isAdmin && (
                <TooltipWrapper text="Pending Verifications">
                  <Link
                    href="/pending-verifications"
                    onClick={handleLinkClick}
                    className={`flex size-11 items-center justify-center rounded-lg text-white outline-hidden transition-colors duration-200 hover:bg-white/20 focus:bg-white/20 active:bg-white/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 ${
                      isActive("/pending-verifications")
                        ? "bg-primary/10 dark:bg-navy-600 dark:text-accent-light"
                        : ""
                    }`}
                  >
                   <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-8"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </Link>
                </TooltipWrapper>
              )}

              {/* History - Doctor Only */}
              {isDoctor && (
                <TooltipWrapper text="History">
                  <Link
                    href="/patient-history"
                    onClick={handleLinkClick}
                    className={`flex size-11 items-center justify-center text-white rounded-lg outline-hidden transition-colors duration-200 hover:bg-white/20 focus:bg-white/20 active:bg-white/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 ${
                      isActive("/patient-history")
                        ? "bg-primary/10 dark:bg-navy-600 dark:text-accent-light"
                        : ""
                    }`}
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
                </TooltipWrapper>
              )}
            </div>

            {/* Bottom Links */}
            <div className="flex flex-col items-center space-y-3 py-3">
              {/* Settings */}
              <TooltipWrapper text="Settings">
                <Link
                  href="/settings"
                  onClick={handleLinkClick}
                  className="flex size-11 items-center justify-center text-white rounded-lg outline-hidden transition-colors duration-200 hover:bg-white/20 focus:bg-white/20 active:bg-white/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
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
              </TooltipWrapper>

              {/* Profile */}
              <div className="flex relative">
                <button
                  ref={profileButtonRef}
                  onClick={() => setProfilePopperOpen(!profilePopperOpen)}
                  className="avatar size-12 cursor-pointer"
                >
                  <Image
                    className="rounded-full"
                    src={user?.profilePictureUrl && user.profilePictureUrl.trim() !== "" ? user.profilePictureUrl : "/images/200x200.png"}
                    alt="avatar"
                    width={48}
                    height={48}
                  />
                  <span className="absolute right-0 size-3.5 rounded-full border-2 border-white bg-success dark:border-navy-700"></span>
                </button>

                {profilePopperOpen &&
                  typeof window !== "undefined" &&
                  createPortal(
                    <div
                      ref={profilePopperRef}
                      className="popper-root fixed show"
                    >
                      <div className="popper-box w-64 rounded-lg border border-slate-150 bg-white shadow-soft dark:border-navy-600 dark:bg-navy-700">
                      <div className="flex items-center space-x-4 rounded-t-lg bg-slate-100 py-5 px-4 dark:bg-navy-800">
                        <div className="avatar size-14">
                          <Image
                            className="rounded-full"
                            src={user?.profilePictureUrl && user.profilePictureUrl.trim() !== "" ? user.profilePictureUrl : "/images/200x200.png"}
                            alt="avatar"
                            width={56}
                            height={56}
                          />
                        </div>
                        <div>
                          <Link
                            href="/profile"
                            onClick={() => setProfilePopperOpen(false)}
                            className="text-base font-medium text-slate-700 hover:text-primary focus:text-primary dark:text-navy-100 dark:hover:text-accent-light dark:focus:text-accent-light"
                          >
                            {user?.email?.split("@")[0] || "User"}
                          </Link>
                          <p className="text-xs text-slate-400 dark:text-navy-300">
                            {user?.role || "User"}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col pt-2 pb-5">
                        <Link
                          href="/profile"
                          onClick={() => setProfilePopperOpen(false)}
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
                        <div className="mt-3 px-4">
                          <button
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className={`btn h-9 w-full space-x-2 text-white ${
                              theme === "admin"
                                ? "bg-green-600 hover:bg-green-700 focus:bg-green-700 active:bg-green-800 dark:bg-green-500 dark:hover:bg-green-600 dark:focus:bg-green-600 dark:active:bg-green-700"
                                : "bg-primary hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
                            } ${isLoggingOut ? "opacity-60 cursor-not-allowed" : ""}`}
                          >
                            {isLoggingOut ? (
                              <>
                                <svg
                                  className="size-5 animate-spin"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  ></path>
                                </svg>
                                <span>Logging out...</span>
                              </>
                            ) : (
                              <>
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
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>,
                  document.body
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Tooltip.Provider>
  );
}
