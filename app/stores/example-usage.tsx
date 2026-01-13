/**
 * Example usage of Zustand stores
 * This file demonstrates how to use the stores in your components
 */

"use client";

import { useAuthStore, useUIStore } from "./index";

// Example 1: Using auth store
export function AuthExample() {
  const { isAuthenticated, login, logout, userEmail } = useAuthStore();

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {userEmail}</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={() => login("user@example.com", true)}>Login</button>
      )}
    </div>
  );
}

// Example 2: Using UI store
export function UIExample() {
  const { darkMode, toggleDarkMode, sidebarExpanded, setSidebarExpanded } =
    useUIStore();

  return (
    <div>
      <button onClick={toggleDarkMode}>
        {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      </button>
      <button onClick={() => setSidebarExpanded(!sidebarExpanded)}>
        {sidebarExpanded ? "Collapse" : "Expand"} Sidebar
      </button>
    </div>
  );
}

// Example 3: Using multiple stores
export function MultiStoreExample() {
  const { isAuthenticated } = useAuthStore();
  const { darkMode, sidebarExpanded } = useUIStore();

  return (
    <div>
      <p>Authenticated: {isAuthenticated ? "Yes" : "No"}</p>
      <p>Dark Mode: {darkMode ? "On" : "Off"}</p>
      <p>Sidebar: {sidebarExpanded ? "Expanded" : "Collapsed"}</p>
    </div>
  );
}

// Example 4: Selective state subscription (only re-renders when specific state changes)
export function SelectiveSubscriptionExample() {
  // Only re-renders when isAuthenticated changes, not when other auth state changes
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Only re-renders when darkMode changes, not when other UI state changes
  const darkMode = useUIStore((state) => state.darkMode);

  return (
    <div>
      <p>Auth: {isAuthenticated ? "Yes" : "No"}</p>
      <p>Dark: {darkMode ? "On" : "Off"}</p>
    </div>
  );
}
