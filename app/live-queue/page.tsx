import DashboardLayout from "../components/DashboardLayout";
import PatientCard from "../components/PatientCard";
import PatientCardWithMenu from "../components/PatientCardWithMenu";

export default function LiveQueuePage() {
  const patients = [
    { id: 1, name: "Konnor Guzman", age: 34, timeAgo: "8 mins ago", symptom: "Patient Symptom" },
    { id: 2, name: "Travis Fuller", age: 34, timeAgo: "8 mins ago", symptom: "Patient Symptom" },
    { id: 3, name: "Alfredo Elliott", age: 34, timeAgo: "8 mins ago", symptom: "Patient Symptom" },
    { id: 4, name: "Derrick Simmons", age: 34, timeAgo: "8 mins ago", symptom: "Patient Symptom" },
    { id: 5, name: "Katrina West", age: 34, timeAgo: "8 mins ago", symptom: "Patient Symptom" },
    { id: 6, name: "Henry Curtis", age: 34, timeAgo: "8 mins ago", symptom: "Patient Symptom" },
    { id: 7, name: "Raul Bradley", age: 34, timeAgo: "8 mins ago", symptom: "Patient Symptom" },
    { id: 8, name: "Samantha Shelton", age: 34, timeAgo: "8 mins ago", symptom: "Patient Symptom" },
    { id: 9, name: "Corey Evans", age: 34, timeAgo: "8 mins ago", symptom: "Patient Symptom" },
    { id: 10, name: "Lance Tucker", age: 34, timeAgo: "8 mins ago", symptom: "Patient Symptom" },
    { id: 11, name: "Anthony Jensen", age: 34, timeAgo: "8 mins ago", symptom: "Patient Symptom" },
    { id: 12, name: "Joe Perkins", age: 34, timeAgo: "8 mins ago", symptom: "Patient Symptom" },
  ];

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between py-5 lg:py-6">
        <div className="flex items-center space-x-1">
          <h2 className="text-xl font-medium text-slate-700 line-clamp-1 dark:text-navy-50 lg:text-2xl">
            Live Patient Queue
          </h2>
        </div>

        <div className="flex items-center space-x-2">
          <label className="relative hidden sm:flex">
            <input
              className="form-input peer h-9 w-full rounded-full border border-slate-300 bg-transparent px-3 py-2 pl-9 text-xs-plus placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
              placeholder="Search users..."
              type="text"
            />
            <span className="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-4 transition-colors duration-200"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M3.316 13.781l.73-.171-.73.171zm0-5.457l.73.171-.73-.171zm15.473 0l.73-.171-.73.171zm0 5.457l.73.171-.73-.171zm-5.008 5.008l-.171-.73.171.73zm-5.457 0l-.171.73.171-.73zm0-15.473l-.171-.73.171.73zm5.457 0l.171-.73-.171.73zM20.47 21.53a.75.75 0 101.06-1.06l-1.06 1.06zM4.046 13.61a11.198 11.198 0 010-5.115l-1.46-.342a12.698 12.698 0 000 5.8l1.46-.343zm14.013-5.115a11.196 11.196 0 010 5.115l1.46.342a12.698 12.698 0 000-5.8l-1.46.343zm-4.45 9.564a11.196 11.196 0 01-5.114 0l-.342 1.46c1.907.448 3.892.448 5.8 0l-.343-1.46zM8.496 4.046a11.198 11.198 0 015.115 0l.342-1.46a12.698 12.698 0 00-5.8 0l.343 1.46zm0 14.013a5.97 5.97 0 01-4.45-4.45l-1.46.343a7.47 7.47 0 005.568 5.568l.342-1.46zm5.457 1.46a7.47 7.47 0 005.568-5.567l-1.46-.342a5.97 5.97 0 01-4.45 4.45l.342 1.46zM13.61 4.046a5.97 5.97 0 014.45 4.45l1.46-.343a7.47 7.47 0 00-5.568-5.567l-.342 1.46zm-5.457-1.46a7.47 7.47 0 00-5.567 5.567l1.46.342a5.97 5.97 0 014.45-4.45l-.343-1.46zm8.652 15.28l3.665 3.664 1.06-1.06-3.665-3.665-1.06 1.06z" />
              </svg>
            </span>
          </label>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
        {patients.slice(0, 11).map((patient) => (
          <PatientCard key={patient.id} {...patient} />
        ))}
        {/* Last card with menu */}
        <PatientCardWithMenu {...patients[11]} />
      </div>
      <div className="mt-10">
        <ol className="pagination space-x-1.5">
          <li>
            <a
              href="#"
              className="flex size-8 items-center justify-center rounded-lg bg-slate-150 text-slate-500 transition-colors hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300/80 dark:bg-navy-500 dark:text-navy-200 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex h-8 min-w-[2rem] items-center justify-center rounded-lg bg-primary px-3 leading-tight text-white transition-colors hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
            >
              1
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex h-8 min-w-[2rem] items-center justify-center rounded-lg bg-slate-150 px-3 leading-tight transition-colors hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300/80 dark:bg-navy-500 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
            >
              2
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex h-8 min-w-[2rem] items-center justify-center rounded-lg bg-slate-150 px-3 leading-tight transition-colors hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300/80 dark:bg-navy-500 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
            >
              3
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex h-8 min-w-[2rem] items-center justify-center rounded-lg bg-slate-150 px-3 leading-tight transition-colors hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300/80 dark:bg-navy-500 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
            >
              4
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex h-8 min-w-[2rem] items-center justify-center rounded-lg bg-slate-150 px-3 leading-tight transition-colors hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300/80 dark:bg-navy-500 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
            >
              5
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex size-8 items-center justify-center rounded-lg bg-slate-150 text-slate-500 transition-colors hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300/80 dark:bg-navy-500 dark:text-navy-200 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
            >
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
                ></path>
              </svg>
            </a>
          </li>
        </ol>
      </div>
    </DashboardLayout>
  );
}
