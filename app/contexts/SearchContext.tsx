"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

interface SearchContextValue {
  query: string;
  setQuery: (q: string) => void;
  placeholder: string;
  isPageSearch: boolean;
  registerPageSearch: (placeholder: string) => void;
  unregisterPageSearch: () => void;
}

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQueryState] = useState("");
  const [placeholder, setPlaceholder] = useState("Search here...");
  const [isPageSearch, setIsPageSearch] = useState(false);

  const setQuery = useCallback((q: string) => {
    setQueryState(q);
  }, []);

  const registerPageSearch = useCallback((ph: string) => {
    setPlaceholder(ph);
    setIsPageSearch(true);
    setQueryState("");
  }, []);

  const unregisterPageSearch = useCallback(() => {
    setPlaceholder("Search here...");
    setIsPageSearch(false);
    setQueryState("");
  }, []);

  return (
    <SearchContext.Provider
      value={{
        query,
        setQuery,
        placeholder,
        isPageSearch,
        registerPageSearch,
        unregisterPageSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearchContext() {
  const ctx = useContext(SearchContext);
  if (!ctx)
    throw new Error("useSearchContext must be used within SearchProvider");
  return ctx;
}
