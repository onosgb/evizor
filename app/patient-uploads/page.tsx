import DashboardLayout from "../components/DashboardLayout";
import Link from "next/link";
import Image from "next/image";
import PatientSidebar from "../components/PatientSidebar";
import ActionButtons from "../components/ActionButtons";
import ImageCarousel from "./_components/ImageCarousel";

export default function PatientUploadsPage() {
  const images = [
    { id: 1, src: "/images/800x600.png", alt: "Uploaded file 1" },
    { id: 2, src: "/images/800x600.png", alt: "Uploaded file 2" },
    { id: 3, src: "/images/800x600.png", alt: "Uploaded file 3" },
    { id: 4, src: "/images/800x600.png", alt: "Uploaded file 4" },
  ];

  return (
    <DashboardLayout>
      {/* Breadcrumb Header */}
      <div className="flex items-center space-x-4 py-5 lg:py-6">
        <h2 className="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">
          Patient Preview
        </h2>
        <div className="hidden h-full py-1 sm:flex">
          <div className="h-full w-px bg-slate-300 dark:bg-navy-600"></div>
        </div>
        <ul className="hidden flex-wrap items-center space-x-2 sm:flex">
          <li className="flex items-center space-x-2">
            <Link
              href="/live-queue"
              className="text-primary transition-colors hover:text-primary-focus dark:text-accent-light dark:hover:text-accent"
            >
              Live Queue
            </Link>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </li>
          <li>Patient Preview</li>
        </ul>
      </div>

      <div className="grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6">
        {/* Sidebar */}
        <div className="col-span-12 lg:col-span-4">
          <PatientSidebar />
        </div>

        {/* Main Content */}
        <div className="col-span-12 lg:col-span-8">
          <div className="card">
            <div className="flex flex-col items-center space-y-4 border-b border-slate-200 p-4 dark:border-navy-500 sm:flex-row sm:justify-between sm:space-y-0 sm:px-5">
              <h2 className="text-lg font-medium tracking-wide text-slate-700 dark:text-navy-100">
                Uploaded Files Preview
              </h2>
              <ActionButtons />
            </div>
            <div className="p-4 sm:p-5">
              <ImageCarousel images={images} />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
