"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useEffect } from "react";
import { userStore } from "@/store/user.store";
import { TokenService } from "@/shared/tokens.service";
import * as Tooltip from "@radix-ui/react-tooltip";
import { createPortal } from "react-dom";
import {
  Home,
  Wallet,
  User,
  FileText,
  Phone,
  LogOut,
  LayoutDashboard,
  Store,
  Settings,
  Gift,
  Lock as LockIcon,
} from "lucide-react";

// Custom Naira icon component
const NairaIcon = ({ className = "" }: { className?: string }) => {
  // Extract size from className (e.g., "size-6" = 24px)
  const sizeMatch = className?.match(/size-(\d+)/);
  const iconSize = sizeMatch ? parseInt(sizeMatch[1]) * 4 : 24;
  
  return (
    <span className={`font-bold text-white inline-flex items-center justify-center ${className}`} style={{ fontSize: `${iconSize}px`, lineHeight: 1 }}>
      ₦
    </span>
  );
};
import { useState } from "react";
import { Spinner } from "./spinner";

interface SidebarProps {
  sidebarExpanded: boolean;
  profilePopperOpen: boolean;
  setProfilePopperOpen: (open: boolean) => void;
  setSidebarExpanded: (expanded: boolean) => void;
}

export default function Sidebar({
  sidebarExpanded,
  profilePopperOpen,
  setProfilePopperOpen,
  setSidebarExpanded,
}: SidebarProps) {
  const pathname = usePathname();
  const profileButtonRef = useRef<HTMLButtonElement>(null);
  const profilePopperRef = useRef<HTMLDivElement>(null);
  const { data: user } = userStore();
  const tokenService = new TokenService();
  const isAdmin = user?.role === "Admin";
  const isMerchant = user?.role === "Merchant";
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Call logout API to invalidate tokens on server
      // This invalidates all tokens (access and refresh) immediately
      await tokenService.logout();
    } catch (error) {
      // Continue with local logout even if API call fails
      // This ensures user can logout even if network is down or token is expired
      console.error("Logout error:", error);
    } finally {
      // Always clear local storage and reset state
      tokenService.clearStorage();
      userStore.setState({ data: null, status: "idle", error: null });
      await new Promise((resolve) => setTimeout(resolve, 100));
      window.location.href = "/";
    }
  };

  // Prevent body scroll on mobile when sidebar is open
  useEffect(() => {
    if (sidebarExpanded) {
      document.body.style.overflow = "hidden";
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
      const horizontalOffset = 10; // Reduced from 255 to bring it closer
      
      const popperHeight = popper.offsetHeight || 450;
      const topPosition = buttonRect.top - popperHeight - verticalOffset;
      
      const sidebarContainer = profileButtonRef.current.closest('[class*="w-20"], [class*="sidebar"]') as HTMLElement;
      const sidebarRect = sidebarContainer?.getBoundingClientRect();
      const sidebarRight = sidebarRect?.right || buttonRect.right;
      
      const leftPosition = sidebarRight + horizontalOffset;
      
      popper.style.position = "fixed";
      popper.style.top = `${topPosition}px`;
      popper.style.left = `${leftPosition}px`;
      popper.style.zIndex = "9999";
      popper.style.maxWidth = "none";
      popper.style.overflow = "visible";
      popper.style.pointerEvents = "auto";
      
      if (topPosition < 10) {
        popper.style.top = `${buttonRect.bottom + verticalOffset}px`;
      }
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(updatePosition);
    });

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

    const handleResize = () => {
      updatePosition();
    };

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

  // Menu items (filter out referral for admins)
  const allMenuItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Wallet, label: "Cashback History", href: "/cashback/history" },
    { icon: FileText, label: "Transactions", href: "/transactions" },
    { icon: Gift, label: "Referral", href: "/referral" },
  ];
  
  const menuItems = isAdmin
    ? allMenuItems.filter((item) => item.href !== "/referral")
    : allMenuItems;

  // Merchant-only menu items
  const merchantMenuItems: Array<{ icon: React.ComponentType<{ size?: number; className?: string }>; label: string; href: string }> = [];

  // Admin-only menu items
  const adminMenuItems = [
    { icon: NairaIcon, label: "Credit", href: "/credit" },
    { icon: FileText, label: "Audit Logs", href: "/audit-logs" },
  ];

  return (
    <Tooltip.Provider delayDuration={200}>
      <div
        className={` 
          fixed left-0 top-20 h-[calc(100vh-5rem)] z-40
          transform transition-transform duration-300 ease-in-out
          ${sidebarExpanded ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:z-40
        `}
      >
        <div className="h-full w-20 overflow-visible">
          <div
            className={`flex h-full w-full flex-col items-center justify-between border-r border-slate-150 bg-green-600 dark:border-navy-700 dark:bg-navy-800 overflow-visible`}
          >
            {/* Main Sections Links */}
            <div className="is-scrollbar-hidden flex grow flex-col space-y-4 overflow-y-auto pt-6">
              {/* Dashboard */}
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <TooltipWrapper key={index} text={item.label}>
                    <Link
                      href={item.href}
                      onClick={handleLinkClick}
                      className={`flex size-11 items-center justify-center rounded-lg text-white outline-hidden transition-colors duration-200 hover:bg-white/20 focus:bg-white/20 active:bg-white/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 ${
                        isActive(item.href)
                          ? "bg-white/10 dark:bg-navy-600 dark:text-accent-light"
                          : ""
                      }`}
                    >
                      <Icon className="size-6" />
                    </Link>
                  </TooltipWrapper>
                );
              })}

              {/* Merchant-only menu items */}
              {isMerchant &&
                merchantMenuItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <TooltipWrapper key={`merchant-${index}`} text={item.label}>
                      <Link
                        href={item.href}
                        onClick={handleLinkClick}
                        className={`flex size-11 items-center justify-center rounded-lg text-white outline-hidden transition-colors duration-200 hover:bg-white/20 focus:bg-white/20 active:bg-white/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 ${
                          isActive(item.href)
                            ? "bg-white/10 dark:bg-navy-600 dark:text-accent-light"
                            : ""
                        }`}
                      >
                        <Icon className="size-6" />
                      </Link>
                    </TooltipWrapper>
                  );
                })}

              {/* Admin-only menu items */}
              {isAdmin &&
                adminMenuItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <TooltipWrapper key={`admin-${index}`} text={item.label}>
                      <Link
                        href={item.href}
                        onClick={handleLinkClick}
                        className={`flex size-11 items-center justify-center rounded-lg text-white outline-hidden transition-colors duration-200 hover:bg-white/20 focus:bg-white/20 active:bg-white/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 ${
                          isActive(item.href)
                            ? "bg-white/10 dark:bg-navy-600 dark:text-accent-light"
                            : ""
                        }`}
                      >
                        <Icon className="size-6" />
                      </Link>
                    </TooltipWrapper>
                  );
                })}

              {/* Convert to Merchant - for users only */}
              {user && user.role === "User" && (
                <TooltipWrapper text="Convert to Merchant">
                  <Link
                    href="/merchant/convert"
                    onClick={handleLinkClick}
                    className={`flex size-11 items-center justify-center rounded-lg text-white outline-hidden transition-colors duration-200 hover:bg-white/20 focus:bg-white/20 active:bg-white/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 ${
                      isActive("/merchant/convert")
                        ? "bg-white/10 dark:bg-navy-600 dark:text-accent-light"
                        : ""
                    }`}
                  >
                    <Store className="size-6" />
                  </Link>
                </TooltipWrapper>
              )}
            </div>

            {/* Bottom Links */}
            <div className="flex flex-col items-center space-y-3 py-3 pb-8 lg:pb-3">
              {/* Profile */}
              {user && (
                <div className="flex relative">
                  <button
                    ref={profileButtonRef}
                    onClick={() => setProfilePopperOpen(!profilePopperOpen)}
                    className="avatar size-12 cursor-pointer relative"
                  >
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-green-600 font-semibold text-lg">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="absolute top-0 right-0 size-3.5 rounded-full border-2 border-white bg-green-500 dark:border-navy-700 translate-x-0.5 -translate-y-0.5"></span>
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
                              <div className="w-14 h-14 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold text-xl">
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                            </div>
                            <div>
                              <Link
                                href="/profile"
                                onClick={() => setProfilePopperOpen(false)}
                                className="text-base font-medium text-slate-700 hover:text-primary focus:text-primary dark:text-navy-100 dark:hover:text-accent-light dark:focus:text-accent-light"
                              >
                                {user.name}
                              </Link>
                              <p className="text-xs text-slate-400 dark:text-navy-300">
                                {user.email}
                              </p>
                              <p className="text-xs text-slate-400 dark:text-navy-300">
                                {user.role}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col pt-2 pb-5">
                            <Link
                              href="/profile"
                              onClick={() => setProfilePopperOpen(false)}
                              className="group flex items-center space-x-3 py-2 px-4 tracking-wide outline-hidden transition-all hover:bg-slate-100 focus:bg-slate-100 dark:hover:bg-navy-600 dark:focus:bg-navy-600"
                            >
                              <div className="flex size-8 items-center justify-center rounded-lg bg-yellow-500 text-white">
                                <User className="size-4.5" />
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
                              href="/change-password"
                              onClick={() => setProfilePopperOpen(false)}
                              className="group flex items-center space-x-3 py-2 px-4 tracking-wide outline-hidden transition-all hover:bg-slate-100 focus:bg-slate-100 dark:hover:bg-navy-600 dark:focus:bg-navy-600"
                            >
                              <div className="flex size-8 items-center justify-center rounded-lg bg-purple-500 text-white">
                                <LockIcon className="size-4.5" />
                              </div>
                              <div>
                                <h2 className="font-medium text-slate-700 transition-colors group-hover:text-primary group-focus:text-primary dark:text-navy-100 dark:group-hover:text-accent-light dark:group-focus:text-accent-light">
                                  Change Password
                                </h2>
                                <div className="text-xs text-slate-400 line-clamp-1 dark:text-navy-300">
                                  Update your password
                                </div>
                              </div>
                            </Link>
                            <Link
                              href="/settings"
                              onClick={() => setProfilePopperOpen(false)}
                              className="group flex items-center space-x-3 py-2 px-4 tracking-wide outline-hidden transition-all hover:bg-slate-100 focus:bg-slate-100 dark:hover:bg-navy-600 dark:focus:bg-navy-600"
                            >
                              <div className="flex size-8 items-center justify-center rounded-lg bg-green-500 text-white">
                                <Settings className="size-4.5" />
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
                            <Link
                              href="/contact"
                              onClick={() => setProfilePopperOpen(false)}
                              className="group flex items-center space-x-3 py-2 px-4 tracking-wide outline-hidden transition-all hover:bg-slate-100 focus:bg-slate-100 dark:hover:bg-navy-600 dark:focus:bg-navy-600"
                            >
                              <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500 text-white">
                                <Phone className="size-4.5" />
                              </div>
                              <div>
                                <h2 className="font-medium text-slate-700 transition-colors group-hover:text-primary group-focus:text-primary dark:text-navy-100 dark:group-hover:text-accent-light dark:group-focus:text-accent-light">
                                  Contact Support
                                </h2>
                                <div className="text-xs text-slate-400 line-clamp-1 dark:text-navy-300">
                                  Get help and support
                                </div>
                              </div>
                            </Link>
                            <div className="mt-3 px-4">
                              <button
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                                className="flex items-center justify-center gap-2 h-9 w-full rounded-md text-white bg-green-600 hover:bg-green-700 focus:bg-green-700 active:bg-green-800 dark:bg-green-500 dark:hover:bg-green-600 dark:focus:bg-green-600 dark:active:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isLoggingOut ? (
                                  <>
                                    <Spinner size="sm" color="white" />
                                    <span>Logging out...</span>
                                  </>
                                ) : (
                                  <>
                                    <LogOut className="size-5" />
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
              )}
            </div>
          </div>
        </div>
      </div>
    </Tooltip.Provider>
  );
}
