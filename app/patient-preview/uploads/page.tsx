"use client";

import ActionButtons from "../../components/ActionButtons";
import ImageCarousel from "./_components/ImageCarousel";
import { useAppointmentStore } from "../../stores/appointmentStore";

export default function PatientUploadsPage() {
  const { isLoading } = useAppointmentStore();

  const images = [
    { id: 1, src: "/images/800x600.png", alt: "Uploaded file 1" },
    { id: 2, src: "/images/800x600.png", alt: "Uploaded file 2" },
    { id: 3, src: "/images/800x600.png", alt: "Uploaded file 3" },
    { id: 4, src: "/images/800x600.png", alt: "Uploaded file 4" },
  ];

  return (
    <div className="card">
      <div className="flex flex-col items-center space-y-4 border-b border-slate-200 p-4 dark:border-navy-500 sm:flex-row sm:justify-between sm:space-y-0 sm:px-5">
        <h2 className="text-lg font-medium tracking-wide text-slate-700 dark:text-navy-100">
          Uploaded Files Preview
        </h2>
        <ActionButtons />
      </div>
      <div className="p-4 sm:p-5">
        {isLoading ? (
          <div className="animate-pulse grid grid-cols-2 gap-4 sm:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-video w-full rounded-lg bg-slate-200 dark:bg-navy-500"
              />
            ))}
          </div>
        ) : (
          <ImageCarousel images={images} />
        )}
      </div>
    </div>
  );
}
