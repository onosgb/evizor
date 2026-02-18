"use client";

import { useState } from "react";

interface HistoryItem {
  id: string;
  title: string;
  date: string;
  description: string;
  details?: {
    primaryComplaint?: string;
    selectedSymptoms?: string;
    duration?: string;
    severityLevel?: string;
  };
}

interface HistoryAccordionProps {
  items: HistoryItem[];
}

export default function HistoryAccordion({ items }: HistoryAccordionProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  return (
    <div className="flex flex-col space-y-4 sm:space-y-5 lg:space-y-6">
      {items.map((item) => (
        <div
          key={item.id}
          className="overflow-hidden rounded-lg border border-slate-150 dark:border-navy-500"
        >
          <div className="flex items-center justify-between bg-slate-150 px-4 py-4 dark:bg-navy-500 sm:px-5">
            <div className="flex items-center space-x-3.5 tracking-wide outline-hidden transition-all">
              <div className="avatar size-10">
                <div className="is-initial rounded-full bg-info uppercase text-white">
                  {item.title.substring(0, 2).toUpperCase()}
                </div>
              </div>
              <div>
                <p className="text-slate-700 line-clamp-1 dark:text-navy-100">
                  {item.title}
                </p>
                <p className="text-xs text-slate-500 dark:text-navy-300">{item.date}</p>
              </div>
            </div>
            <button
              onClick={() => toggleItem(item.id)}
              className="btn -mr-1.5 size-8 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`size-4 text-sm transition-transform ${
                  expandedItem === item.id ? "-rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
          {expandedItem === item.id && (
            <div className="px-4 py-4 sm:px-5">
              <p>{item.description}</p>
              {item.details && (
                <div className="mt-4">
                  <div className="grid grid-cols-1 gap-4">
                    {item.details.primaryComplaint && (
                      <label className="block">
                        <span>Primary Complaint</span>
                        <span className="relative mt-1.5 flex">
                          <span className="text-base font-medium text-slate-600 dark:text-navy-100">
                            {item.details.primaryComplaint}
                          </span>
                        </span>
                      </label>
                    )}
                    {item.details.selectedSymptoms && (
                      <label className="block">
                        <span>Selected Symptoms</span>
                        <span className="relative mt-1.5 flex">
                          <span className="text-base font-medium text-slate-600 dark:text-navy-100">
                            {item.details.selectedSymptoms}
                          </span>
                        </span>
                      </label>
                    )}
                    {item.details.duration && (
                      <label className="block">
                        <span>Duration of Symptoms</span>
                        <span className="relative mt-1.5 flex">
                          <span className="text-base font-medium text-slate-600 dark:text-navy-100">
                            {item.details.duration}
                          </span>
                        </span>
                      </label>
                    )}
                    {item.details.severityLevel && (
                      <label className="block">
                        <span>Severity Level</span>
                        <span className="relative mt-1.5 flex">
                          <span className="text-base font-medium text-slate-600 dark:text-navy-100">
                            {item.details.severityLevel}
                          </span>
                        </span>
                      </label>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
