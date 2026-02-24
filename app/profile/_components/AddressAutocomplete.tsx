"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface Suggestion {
  id: string;
  place_name: string;
}

interface AddressAutocompleteProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddressSelect: (address: string) => void;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
}

export default function AddressAutocomplete({
  name,
  value,
  onChange,
  onAddressSelect,
  placeholder = "Enter address",
  className = "",
  readOnly = false,
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [dropUp, setDropUp] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  const fetchSuggestions = useCallback(
    async (query: string) => {
      if (!query.trim() || query.length < 3 || !accessToken) {
        setSuggestions([]);
        setIsOpen(false);
        return;
      }

      try {
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${accessToken}&autocomplete=true&limit=5&types=address,place`;
        const res = await fetch(url);
        if (!res.ok) return;
        const data = await res.json();
        const features: Suggestion[] = (data.features ?? []).map((f: any) => ({
          id: f.id,
          place_name: f.place_name,
        }));
        setSuggestions(features);
        if (features.length > 0 && containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const spaceBelow = window.innerHeight - rect.bottom;
          setDropUp(spaceBelow < 220);
        }
        setIsOpen(features.length > 0);
        setActiveIndex(-1);
      } catch {
        setSuggestions([]);
        setIsOpen(false);
      }
    },
    [accessToken]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e);
    const query = e.target.value;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(query), 300);
  };

  const handleSelect = (suggestion: Suggestion) => {
    onAddressSelect(suggestion.place_name);
    setSuggestions([]);
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[activeIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <input
        name={name}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => suggestions.length > 0 && setIsOpen(true)}
        readOnly={readOnly}
        className={className}
        placeholder={placeholder}
        type="text"
        autoComplete="off"
      />

      {isOpen && suggestions.length > 0 && (
        <ul
          className={`absolute z-50 w-full rounded-lg border border-slate-200 bg-white shadow-lg dark:border-navy-600 dark:bg-navy-700 ${
            dropUp ? "bottom-full mb-1" : "top-full mt-1"
          }`}
        >
          {suggestions.map((s, i) => (
            <li
              key={s.id}
              onMouseDown={() => handleSelect(s)}
              className={`cursor-pointer px-4 py-2.5 text-sm transition-colors ${
                i === activeIndex
                  ? "bg-primary/10 text-primary dark:bg-navy-600"
                  : "text-slate-700 hover:bg-slate-50 dark:text-navy-100 dark:hover:bg-navy-600"
              } ${i === 0 ? "rounded-t-lg" : ""} ${
                i === suggestions.length - 1 ? "rounded-b-lg" : "border-b border-slate-100 dark:border-navy-600"
              }`}
            >
              {s.place_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
