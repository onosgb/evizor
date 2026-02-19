"use client";

import { useState, useEffect } from "react";

interface AttachmentsViewerProps {
  attachments: string[];
}

export default function AttachmentsViewer({ attachments }: AttachmentsViewerProps) {
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    document.body.style.overflow = lightbox ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightbox]);

  const prev = () => setCurrent((i) => (i - 1 + attachments.length) % attachments.length);
  const next = () => setCurrent((i) => (i + 1) % attachments.length);

  return (
    <>
      <div className="relative select-none overflow-hidden rounded-lg">
        {/* Slide */}
        <div className="relative aspect-video w-full cursor-zoom-in" onClick={() => setLightbox(true)}>
          {attachments.map((url, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={url}
              alt={`Attachment ${i + 1}`}
              className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ${
                i === current ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>

        {/* Prev / Next arrows */}
        {attachments.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/60"
              aria-label="Previous"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/60"
              aria-label="Next"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Counter */}
        <div className="absolute bottom-3 right-3 rounded-full bg-black/50 px-2.5 py-1 text-xs text-white">
          {current + 1} / {attachments.length}
        </div>
      </div>

      {/* Dot indicators */}
      {attachments.length > 1 && (
        <div className="mt-3 flex justify-center gap-2">
          {attachments.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all ${
                i === current ? "w-8 bg-primary dark:bg-accent" : "w-2 bg-slate-300 dark:bg-navy-600"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setLightbox(false)}
        >
          <button
            onClick={() => setLightbox(false)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={attachments[current]}
            alt={`Attachment ${current + 1}`}
            className="max-h-[90vh] max-w-full rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
