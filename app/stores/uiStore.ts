import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  sidebarExpanded: boolean;
  darkMode: boolean;
  monochromeMode: boolean;
  profilePopperOpen: boolean;
  setSidebarExpanded: (expanded: boolean) => void;
  toggleSidebar: () => void;
  toggleDarkMode: () => void;
  toggleMonochromeMode: () => void;
  setProfilePopperOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarExpanded: false,
      darkMode: false,
      monochromeMode: false,
      profilePopperOpen: false,

      setSidebarExpanded: (expanded) => set({ sidebarExpanded: expanded }),

      toggleSidebar: () =>
        set((state) => ({ sidebarExpanded: !state.sidebarExpanded })),

      toggleDarkMode: () =>
        set((state) => {
          const newDarkMode = !state.darkMode;
          if (typeof window !== "undefined") {
            if (newDarkMode) {
              document.documentElement.classList.add("dark");
            } else {
              document.documentElement.classList.remove("dark");
            }
          }
          return { darkMode: newDarkMode };
        }),

      toggleMonochromeMode: () =>
        set((state) => {
          const newMonochromeMode = !state.monochromeMode;
          if (typeof window !== "undefined") {
            if (newMonochromeMode) {
              document.documentElement.classList.add("monochrome");
            } else {
              document.documentElement.classList.remove("monochrome");
            }
          }
          return { monochromeMode: newMonochromeMode };
        }),

      setProfilePopperOpen: (open) => set({ profilePopperOpen: open }),
    }),
    {
      name: "ui-storage",
      partialize: (state) => ({
        darkMode: state.darkMode,
        monochromeMode: state.monochromeMode,
        sidebarExpanded: state.sidebarExpanded,
      }),
    }
  )
);
