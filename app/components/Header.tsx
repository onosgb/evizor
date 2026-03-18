"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { NOTIFICATION_ITEMS_ALL, NOTIFICATION_ITEMS_ALERTS, NOTIFICATION_ITEMS_EVENTS } from "../constants/dashboardData";
import { useSearchContext } from "../contexts/SearchContext";
import { Calendar, Mic, Search, X, Palette, Bell, Settings } from "lucide-react";

interface HeaderProps {
  sidebarExpanded: boolean;
  setSidebarExpanded: (expanded: boolean) => void;
  monochromeMode: boolean;
  toggleMonochromeMode: () => void;
}

export default function Header({
  sidebarExpanded,
  setSidebarExpanded,
  monochromeMode,
  toggleMonochromeMode,
}: HeaderProps) {
  const { query, setQuery, placeholder, isPageSearch } = useSearchContext();
  const [searchbarActive, setSearchbarActive] = useState(false);
  const [notificationPopperOpen, setNotificationPopperOpen] = useState(false);
  const [notificationTab, setNotificationTab] = useState("tabAll");
  const notificationPopperRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationPopperRef.current &&
        !notificationPopperRef.current.contains(event.target as Node)
      ) {
        setNotificationPopperOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Helper function to render notification icon
  const renderNotificationIcon = (icon: string, iconColor: string) => {
    if (icon === "user-edit") {
      return <i className={`fa fa-user-edit ${iconColor}`}></i>;
    } else if (icon === "calendar") {
      return <Calendar className={`size-5 ${iconColor}`} />;
    } else if (icon === "image") {
      return <i className={`fa-solid fa-image ${iconColor}`}></i>;
    } else if (icon === "leaf") {
      return <i className={`fa fa-leaf ${iconColor}`}></i>;
    } else if (icon === "project-diagram") {
      return <i className={`fa fa-project-diagram ${iconColor}`}></i>;
    } else if (icon === "microphone") {
      return <Mic className={`size-5 ${iconColor}`} />;
    } else if (icon === "history") {
      return <i className={`fa fa-history ${iconColor}`}></i>;
    }
    return null;
  };

  return (
    <>
      {/* App Header */}
      <nav className="header bg-white dark:bg-navy-750 before:bg-white dark:before:bg-navy-750 print:hidden">
        <div className="header-container relative flex w-full px-4 sm:px-5 lg:px-6 print:hidden">
          <div className="flex w-full items-center justify-between">
            {/* Left: Sidebar Toggle Button - Mobile Only */}
            <div className="size-7 lg:hidden">
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

            {/* Desktop placeholder to maintain spacing */}
            <div className="hidden lg:block size-7"></div>

            {/* Right: Header buttons */}
            <div className="-mr-1.5 flex items-center space-x-2">
              {/* Mobile Search Toggle (only shown on pages that register a search) */}
              <button
                onClick={() => setSearchbarActive(!searchbarActive)}
                className={`btn size-8 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 sm:hidden ${!isPageSearch ? "hidden" : ""}`}
              >
                <Search className="size-5.5 text-slate-500 dark:text-navy-100" />
              </button>

              {/* Main Searchbar - Desktop (only shown on pages that register a search) */}
              {isPageSearch && (
                <div className="hidden sm:flex relative mr-4">
                  <div className="relative flex h-8">
                    <input
                      ref={searchInputRef}
                      placeholder={placeholder}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="form-input peer h-full w-72 rounded-full bg-slate-150 px-4 pl-9 text-xs-plus text-slate-800 ring-primary/50 hover:bg-slate-200 focus:ring-3 dark:bg-navy-900/90 dark:text-navy-100 dark:placeholder-navy-300 dark:ring-accent/50 dark:hover:bg-navy-900 dark:focus:bg-navy-900 transition-all duration-200"
                      type="text"
                    />
                    <div className="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent">
                      <Search className="size-4.5 transition-colors duration-200" />
                    </div>
                    {query && (
                      <button
                        type="button"
                        onClick={() => setQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-navy-300 dark:hover:text-navy-100"
                      >
                        <X className="size-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              )}


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
                <Palette className="size-5 text-slate-500 dark:text-navy-100" />
              </button>

              {/* Notification */}
              <div className="flex relative" ref={notificationPopperRef}>
                <button
                  onClick={() =>
                    setNotificationPopperOpen(!notificationPopperOpen)
                  }
                  className="btn relative size-8 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
                >
                  <Bell className="size-5 text-slate-500 dark:text-navy-100" />
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
                            <Settings className="size-4.5" />
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
                        {notificationTab === "tabAll" && (
                          <div className="is-scrollbar-hidden space-y-4 overflow-y-auto px-4 py-4">
                            {NOTIFICATION_ITEMS_ALL.map((item, index) => (
                              <div
                                key={index}
                                className="flex items-center space-x-3"
                              >
                                <div
                                  className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${item.bg}`}
                                >
                                  {renderNotificationIcon(
                                    item.icon,
                                    item.iconColor,
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium text-slate-600 dark:text-navy-100">
                                    {item.title}
                                  </p>
                                  <div
                                    className={`mt-1 text-xs ${
                                      item.isEvent ? "flex" : "line-clamp-1"
                                    } text-slate-400 dark:text-navy-300`}
                                  >
                                    {item.isEvent ? (
                                      <>
                                        <span className="shrink-0">
                                          {item.description.split(" | ")[0]}
                                        </span>
                                        <div className="mx-2 my-1 w-px bg-slate-200 dark:bg-navy-500"></div>
                                        <span className="line-clamp-1">
                                          {item.description.split(" | ")[1]}
                                        </span>
                                      </>
                                    ) : (
                                      item.description
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        {notificationTab === "tabAlerts" && (
                          <div className="is-scrollbar-hidden space-y-4 overflow-y-auto px-4 py-4">
                            {NOTIFICATION_ITEMS_ALERTS.map((item, index) => (
                              <div
                                key={index}
                                className="flex items-center space-x-3"
                              >
                                <div
                                  className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${item.bg}`}
                                >
                                  {renderNotificationIcon(
                                    item.icon,
                                    item.iconColor,
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium text-slate-600 dark:text-navy-100">
                                    {item.title}
                                  </p>
                                  <div className="mt-1 text-xs text-slate-400 line-clamp-1 dark:text-navy-300">
                                    {item.description}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        {notificationTab === "tabEvents" && (
                          <div className="is-scrollbar-hidden space-y-4 overflow-y-auto px-4 py-4">
                            {NOTIFICATION_ITEMS_EVENTS.map((item, index) => (
                              <div
                                key={index}
                                className="flex items-center space-x-3"
                              >
                                <div
                                  className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${item.bg}`}
                                >
                                  {renderNotificationIcon(
                                    item.icon,
                                    item.iconColor,
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium text-slate-600 dark:text-navy-100">
                                    {item.title}
                                  </p>
                                  <div className="mt-1 flex text-xs text-slate-400 dark:text-navy-300">
                                    <span className="shrink-0">
                                      {item.description.split(" | ")[0]}
                                    </span>
                                    <div className="mx-2 my-1 w-px bg-slate-200 dark:bg-navy-500"></div>
                                    <span className="line-clamp-1">
                                      {item.description.split(" | ")[1]}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        {notificationTab === "tabLogs" && (
                          <div className="is-scrollbar-hidden overflow-y-auto px-4">
                            <div className="mt-8 pb-8 text-center">
                              <Image
                                className="mx-auto w-36"
                                src="/images/illustrations/empty-girl-box.svg"
                                alt="image"
                                width={144}
                                height={144}
                              />
                              <div className="mt-5">
                                <p className="text-base font-semibold text-slate-700 dark:text-navy-100">
                                  No any logs
                                </p>
                                <p className="text-slate-400 dark:text-navy-300">
                                  There are no unread logs yet
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
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
                <X className="size-5" />
            </button>
            <input
              className="form-input h-8 w-full bg-transparent placeholder-slate-400 dark:placeholder-navy-300"
              type="text"
              placeholder={placeholder}
              value={isPageSearch ? query : undefined}
              onChange={
                isPageSearch ? (e) => setQuery(e.target.value) : undefined
              }
              autoFocus
            />
          </div>
        </div>
      )}
    </>
  );
}
