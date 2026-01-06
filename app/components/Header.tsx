"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  SEARCH_TABS,
  SEARCH_QUICK_ACCESS_ITEMS,
  SEARCH_RECENT_ITEMS,
  NOTIFICATION_ITEMS_ALL,
  NOTIFICATION_ITEMS_ALERTS,
  NOTIFICATION_ITEMS_EVENTS,
} from "../constants/dashboardData";

interface HeaderProps {
  sidebarExpanded: boolean;
  setSidebarExpanded: (expanded: boolean) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  monochromeMode: boolean;
  toggleMonochromeMode: () => void;
}

export default function Header({
  sidebarExpanded,
  setSidebarExpanded,
  darkMode,
  toggleDarkMode,
  monochromeMode,
  toggleMonochromeMode,
}: HeaderProps) {
  const [searchbarActive, setSearchbarActive] = useState(false);
  const [searchPopperOpen, setSearchPopperOpen] = useState(false);
  const [notificationPopperOpen, setNotificationPopperOpen] = useState(false);
  const [notificationTab, setNotificationTab] = useState("tabAll");
  const [searchTab, setSearchTab] = useState("tabAll");
  const [searchInputWidth, setSearchInputWidth] = useState("w-60");
  const searchPopperRef = useRef<HTMLDivElement>(null);
  const notificationPopperRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  // Helper function to render notification icon
  const renderNotificationIcon = (icon: string, iconColor: string) => {
    if (icon === "user-edit") {
      return <i className={`fa fa-user-edit ${iconColor}`}></i>;
    } else if (icon === "calendar") {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`size-5 ${iconColor}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      );
    } else if (icon === "image") {
      return <i className={`fa-solid fa-image ${iconColor}`}></i>;
    } else if (icon === "leaf") {
      return <i className={`fa fa-leaf ${iconColor}`}></i>;
    } else if (icon === "project-diagram") {
      return <i className={`fa fa-project-diagram ${iconColor}`}></i>;
    } else if (icon === "microphone") {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`size-5 ${iconColor}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
        </svg>
      );
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
                        {SEARCH_TABS.map((tab) => {
                          const tabLabel = tab.replace("tab", "");
                          return (
                            <button
                              key={tab}
                              onClick={() => setSearchTab(tab)}
                              className={`btn shrink-0 rounded-none border-b-2 px-3.5 py-2.5 ${
                                searchTab === tab
                                  ? "border-primary dark:border-accent text-primary dark:text-accent-light"
                                  : "border-transparent hover:text-slate-800 focus:text-slate-800 dark:hover:text-navy-100 dark:focus:text-navy-100"
                              }`}
                            >
                              {tabLabel}
                            </button>
                          );
                        })}
                      </div>
                      <div className="is-scrollbar-hidden overflow-y-auto overscroll-contain pb-2">
                        <div className="is-scrollbar-hidden mt-3 flex space-x-4 overflow-x-auto px-3">
                          {SEARCH_QUICK_ACCESS_ITEMS.map((item) => (
                            <Link
                              key={item.name}
                              href={item.href}
                              className="w-14 text-center"
                            >
                              <div className="avatar size-12">
                                <div
                                  className={`is-initial rounded-full ${item.bg} text-white`}
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
                            </Link>
                          ))}
                        </div>

                        <div className="mt-3 flex items-center justify-between bg-slate-100 py-1.5 px-3 dark:bg-navy-800">
                          <p className="text-xs uppercase text-slate-400 dark:text-navy-300">
                            Recent
                          </p>
                          <Link
                            href="#"
                            className="text-tiny-plus font-medium uppercase text-primary outline-hidden transition-colors duration-300 hover:text-primary/70 focus:text-primary/70 dark:text-accent-light dark:hover:text-accent-light/70 dark:focus:text-accent-light/70"
                          >
                            View All
                          </Link>
                        </div>

                        <div className="mt-1 font-inter font-medium">
                          {SEARCH_RECENT_ITEMS.map((item) => (
                            <Link
                              key={item.name}
                              href={item.href}
                              className="group flex items-center space-x-2 px-2.5 py-2 tracking-wide outline-hidden transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="size-4.5 text-slate-400 transition-colors group-hover:text-slate-500 group-focus:text-slate-500 dark:text-navy-300 dark:group-hover:text-navy-200 dark:group-focus:text-navy-200"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="1.5"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d={item.icon}
                                />
                              </svg>
                              <span>{item.name}</span>
                            </Link>
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
                                    item.iconColor
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
                                    item.iconColor
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
                                    item.iconColor
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
        <div className="fixed inset-0 z-[100] flex flex-col bg-white dark:bg-navy-700 sm:hidden">
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

          <div className="is-scrollbar-hidden flex shrink-0 overflow-x-auto bg-slate-100 px-2 text-slate-600 dark:bg-navy-800 dark:text-navy-200">
            {SEARCH_TABS.map((tab) => {
              const tabLabel = tab.replace("tab", "");
              return (
                <button
                  key={tab}
                  onClick={() => setSearchTab(tab)}
                  className={`btn shrink-0 rounded-none border-b-2 px-3.5 py-2.5 ${
                    searchTab === tab
                      ? "border-primary dark:border-accent text-primary dark:text-accent-light"
                      : "border-transparent hover:text-slate-800 focus:text-slate-800 dark:hover:text-navy-100 dark:focus:text-navy-100"
                  }`}
                >
                  {tabLabel}
                </button>
              );
            })}
          </div>

          <div className="is-scrollbar-hidden overflow-y-auto overscroll-contain pb-2">
            <div className="is-scrollbar-hidden mt-3 flex space-x-4 overflow-x-auto px-3">
              {SEARCH_QUICK_ACCESS_ITEMS.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="w-14 text-center"
                >
                  <div className="avatar size-12">
                    <div
                      className={`is-initial rounded-full ${item.bg} text-white`}
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
                </Link>
              ))}
            </div>

            <div className="mt-3 flex items-center justify-between bg-slate-100 py-1.5 px-3 dark:bg-navy-800">
              <p className="text-xs uppercase text-slate-400 dark:text-navy-300">
                Recent
              </p>
              <Link
                href="#"
                className="text-tiny-plus font-medium uppercase text-primary outline-hidden transition-colors duration-300 hover:text-primary/70 focus:text-primary/70 dark:text-accent-light dark:hover:text-accent-light/70 dark:focus:text-accent-light/70"
              >
                View All
              </Link>
            </div>

            <div className="mt-1 font-inter font-medium">
              {SEARCH_RECENT_ITEMS.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group flex items-center space-x-2 px-2.5 py-2 tracking-wide outline-hidden transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-4.5 text-slate-400 transition-colors group-hover:text-slate-500 group-focus:text-slate-500 dark:text-navy-300 dark:group-hover:text-navy-200 dark:group-focus:text-navy-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d={item.icon}
                    />
                  </svg>
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

