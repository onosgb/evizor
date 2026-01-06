import DashboardLayout from "../components/DashboardLayout";
import Link from "next/link";
import PatientSidebar from "../components/PatientSidebar";
import ActionButtons from "../components/ActionButtons";

export default function PatientPreviewPage() {
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
                Patient Details
              </h2>
              <ActionButtons />
            </div>
            <div className="p-4 sm:p-5">
              <h4 className="text-base">Basic Information</h4>
              <div className="my-7 h-px bg-slate-200 dark:bg-navy-500"></div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block">
                  <span>Patient ID</span>
                  <span className="relative mt-1.5 flex">
                    <span className="text-base font-medium text-slate-600 dark:text-navy-100">
                      00000000000000
                    </span>
                  </span>
                </label>
                <label className="block">
                  <span>Full Name</span>
                  <span className="relative mt-1.5 flex">
                    <span className="text-base font-medium text-slate-600 dark:text-navy-100">
                      Henry Curtis
                    </span>
                  </span>
                </label>
                <label className="block">
                  <span>Date of Birth/Age</span>
                  <span className="relative mt-1.5 flex">
                    <span className="text-base font-medium text-slate-600 dark:text-navy-100">
                      00000000000000
                    </span>
                  </span>
                </label>
                <label className="block">
                  <span>Gender</span>
                  <span className="relative mt-1.5 flex">
                    <span className="text-base font-medium text-slate-600 dark:text-navy-100">
                      Male
                    </span>
                  </span>
                </label>
              </div>

              <h4 className="text-base mt-5">Contact & Visit Context</h4>
              <div className="my-7 h-px bg-slate-200 dark:bg-navy-500"></div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block">
                  <span>Consultation Type</span>
                  <span className="relative mt-1.5 flex">
                    <span className="text-base font-medium text-slate-600 dark:text-navy-100">
                      General / Specialist / Follow-up
                    </span>
                  </span>
                </label>
                <label className="block">
                  <span>Visit Mode</span>
                  <span className="relative mt-1.5 flex">
                    <span className="text-base font-medium text-slate-600 dark:text-navy-100">
                      On-demand / Scheduled
                    </span>
                  </span>
                </label>
                <label className="block">
                  <span>Queue Entry Time</span>
                  <span className="relative mt-1.5 flex">
                    <span className="text-base font-medium text-slate-600 dark:text-navy-100">
                      00000000000000
                    </span>
                  </span>
                </label>
                <label className="block">
                  <span>Waiting Duration</span>
                  <span className="relative mt-1.5 flex">
                    <span className="text-base font-medium text-slate-600 dark:text-navy-100">
                      00000000000000
                    </span>
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
