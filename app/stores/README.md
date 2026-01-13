# Zustand Stores

This directory contains Zustand stores for state management in the application.

## Available Stores

### `authStore`

Manages authentication state including:

- `isAuthenticated`: Whether the user is logged in
- `isLoading`: Loading state during auth checks
- `userEmail`: Current user's email
- `rememberMe`: Remember me preference
- `login(email?, rememberMe?)`: Login function
- `logout()`: Logout function
- `setLoading(loading)`: Set loading state

**Usage:**

```tsx
import { useAuthStore } from "@/app/stores";

function MyComponent() {
  const { isAuthenticated, login, logout } = useAuthStore();

  return (
    <div>
      {isAuthenticated ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <button onClick={() => login("user@example.com")}>Login</button>
      )}
    </div>
  );
}
```

### `uiStore`

Manages UI state including:

- `sidebarExpanded`: Sidebar visibility state
- `darkMode`: Dark mode toggle
- `monochromeMode`: Monochrome mode toggle
- `profilePopperOpen`: Profile menu state
- Various toggle and setter functions

**Usage:**

```tsx
import { useUIStore } from "@/app/stores";

function MyComponent() {
  const { darkMode, toggleDarkMode, sidebarExpanded, setSidebarExpanded } =
    useUIStore();

  return (
    <div>
      <button onClick={toggleDarkMode}>
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>
    </div>
  );
}
```

## Creating New Stores

To create a new store, follow this pattern:

```tsx
import { create } from "zustand";
import { persist } from "zustand/middleware"; // Optional: for persistence

interface MyStoreState {
  // Your state properties
  value: string;
  // Your actions
  setValue: (value: string) => void;
}

export const useMyStore = create<MyStoreState>()(
  persist(
    // Remove persist() wrapper if you don't need persistence
    (set) => ({
      // Initial state
      value: "",

      // Actions
      setValue: (value) => set({ value }),
    }),
    {
      name: "my-store-storage", // Storage key for persistence
    }
  )
);
```

Then export it from `index.ts`:

```tsx
export { useMyStore } from "./myStore";
```

## Benefits of Zustand

- **Simple API**: Minimal boilerplate compared to Redux or Context API
- **TypeScript Support**: Full type safety out of the box
- **Performance**: Only re-renders components that use changed state
- **Persistence**: Built-in middleware for localStorage persistence
- **No Provider Needed**: Can be used anywhere without wrapping components
- **Small Bundle Size**: ~1KB minified + gzipped
