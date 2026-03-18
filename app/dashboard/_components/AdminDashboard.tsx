"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { User, AppointmentStatus, GlobalAnalytics } from "@/app/models";
import { useQueueMonitorStore } from "@/app/stores/queueMonitorStore";
import { formatTodayOrDate } from "@/app/lib/utils/dateUtils";
import { adminService } from "@/app/lib/services/admin.service";
import { LucideIcon, Users, UserPlus, Clock, HeartPulse } from "lucide-react";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

export default function AdminDashboard({ user }: { user: User | null }) {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { appointments, isLoading, setLimit, fetchAppointments } =
    useQueueMonitorStore();

  const [analytics, setAnalytics] = useState<GlobalAnalytics | null>(null);
  const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(true);

  useEffect(() => {
    setLimit(6);
    fetchAppointments();
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setIsAnalyticsLoading(true);
      const response = await adminService.getGlobalAnalytics();
      if (response.status) {
        setAnalytics(response.data.metrics);
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setIsAnalyticsLoading(false);
    }
  };

  useEffect(() => {
    if (isSearchActive && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchActive]);

  const filteredData = (appointments || []).filter(
    (item) =>
      item.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.scheduledAt.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.SCHEDULED:
      case AppointmentStatus.PROGRESS:
        return (
          <div className="flex items-center space-x-2 text-warning">
            <div className="size-2 rounded-full bg-current" />
            <span>Waiting</span>
          </div>
        );
      case AppointmentStatus.COMPLETED:
        return (
          <div className="flex items-center space-x-2 text-success">
            <div className="size-2 rounded-full bg-current" />
            <span>Completed</span>
          </div>
        );
      case AppointmentStatus.CANCELLED:
        return (
          <div className="flex items-center space-x-2 text-error">
            <div className="size-2 rounded-full bg-current" />
            <span>Cancelled</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center space-x-2 text-slate-400">
            <div className="size-2 rounded-full bg-current" />
            <span>{status}</span>
          </div>
        );
    }
  };

  const StatCard = ({ 
    title, 
    value, 
    change, 
    changeType, 
    icon: Icon, 
    colorClass, 
    unit 
  }: { 
    title: string; 
    value: string | number; 
    change?: number; 
    changeType?: string; 
    icon: LucideIcon; 
    colorClass: string;
    unit?: string;
  }) => (
    <div className="card flex-row justify-between p-4 relative overflow-hidden">
      <div>
        <p className="text-xs-plus uppercase font-medium text-slate-500 dark:text-navy-300">{title}</p>
        <div className="mt-8 flex items-baseline space-x-1">
          {isAnalyticsLoading ? (
            <div className="h-8 w-16 animate-pulse rounded bg-slate-200 dark:bg-navy-500" />
          ) : (
            <>
              <p className="text-2xl font-semibold text-slate-700 dark:text-navy-100">
                {value}{unit && <span className="text-sm font-normal ml-1">{unit}</span>}
              </p>
              {change !== undefined && (
                <p className={`text-xs ${
                  changeType === "increase" ? "text-success" : 
                  changeType === "decrease" ? "text-error" : 
                  "text-slate-500"
                }`}>
                  {change > 0 ? "+" : ""}{change}%
                </p>
              )}
            </>
          )}
        </div>
      </div>
      <div className={`mask is-squircle flex size-10 items-center justify-center ${colorClass}/10`}>
        <Icon className={`size-6 ${colorClass === "primary" ? "text-primary" : `text-${colorClass}`}`} />
      </div>
      <div className="absolute bottom-0 right-0 overflow-hidden rounded-lg">
        <Icon className={`size-20 translate-x-1/4 translate-y-1/4 opacity-15 ${colorClass === "primary" ? "text-primary" : `text-${colorClass}`}`} />
      </div>
    </div>
  );

  return (
    <>
      {/* Welcome Card */}
      <div className="mt-4 grid grid-cols-12 gap-4 sm:mt-5 sm:gap-5 lg:mt-6 lg:gap-6">
        <div className="col-span-12 lg:col-span-12 xl:col-span-12">
          <div
            className="card col-span-12 mt-12 bg-linear-to-r p-5 sm:col-span-8 sm:mt-0 sm:flex-row shadow-lg shadow-primary/10"
            style={{ background: "#49941c" }}
          >
            <div className="flex justify-center sm:order-last">
              <Image
                className="-mt-16 h-40 sm:mt-0"
                src="/images/illustrations/user-laptop.svg"
                alt="image"
                width={160}
                height={160}
              />
            </div>
            <div className="mt-2 flex-1 pt-2 text-center text-white sm:mt-0 sm:text-left">
              <p className="text-white pb-2 opacity-80">System Administrator</p>
              <hr className="opacity-20" />
              <h3 className="text-xl mt-4">
                {getGreeting()},{" "}
                <span className="font-semibold">
                  {user?.firstName || "Admin"}
                </span>
              </h3>
              <p className="mt-2 leading-relaxed opacity-90">
                Have a great day at work. Your progress is excellent.
              </p>
              <Link
                href="/profile"
                className="btn mt-6 border border-white/20 bg-white/20 text-white hover:bg-white/30 focus:bg-white/30"
              >
                View Profile
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
        <StatCard
          title="Active Doctors"
          value={analytics?.activeDoctors.value || 0}
          change={analytics?.activeDoctors.change}
          changeType={analytics?.activeDoctors.changeType}
          icon={Users}
          colorClass="warning"
        />
        <StatCard
          title="Waiting Patients"
          value={analytics?.waitingPatients.value || 0}
          change={analytics?.waitingPatients.change}
          changeType={analytics?.waitingPatients.changeType}
          icon={UserPlus}
          colorClass="info"
        />
        <StatCard
          title="Avg Waiting Time"
          value={analytics?.avgWaitingTime.value || 0}
          unit={analytics?.avgWaitingTime.unit || "min"}
          change={analytics?.avgWaitingTime.change}
          changeType={analytics?.avgWaitingTime.changeType}
          icon={Clock}
          colorClass="primary"
        />
        <StatCard
          title="Consultations Today"
          value={analytics?.consultationsToday.value || 0}
          change={analytics?.consultationsToday.change}
          changeType={analytics?.consultationsToday.changeType}
          icon={HeartPulse}
          colorClass="error"
        />
      </div>

      {/* Queue Monitor Table */}
      <div className="mt-4 sm:mt-5 lg:mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100">
            Queue Monitor
          </h2>
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <label className="block">
                <input
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`form-input bg-transparent px-1 text-right transition-all duration-100 placeholder:text-slate-500 dark:placeholder:text-navy-200 ${
                    isSearchActive ? "w-32 lg:w-48" : "w-0"
                  }`}
                  placeholder="Search here..."
                  type="text"
                />
              </label>
              <button
                onClick={() => setIsSearchActive(!isSearchActive)}
                className="btn size-8 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-4.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
            <Link
              href="/queue-monitor"
              className="border-b border-dotted border-current pb-0.5 text-xs-plus font-medium text-primary outline-hidden transition-colors duration-300 hover:text-primary/70 focus:text-primary/70 dark:text-accent-light dark:hover:text-accent-light/70 dark:focus:text-accent-light/70"
            >
              View All
            </Link>
          </div>
        </div>
        <div className="card mt-3">
          <div className="is-scrollbar-hidden min-w-full overflow-x-auto">
            <table className="is-hoverable w-full text-left">
              <thead>
                <tr>
                  <th className="whitespace-nowrap rounded-tl-lg bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                    PATIENT
                  </th>
                  <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                    ASSIGNED DOCTOR
                  </th>
                  <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                    DATETIME
                  </th>
                  <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                    STATUS
                  </th>
                  <th className="whitespace-nowrap rounded-tr-lg bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5"></th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr
                      key={i}
                      className="border-y border-transparent border-b-slate-200 dark:border-b-navy-500 animate-pulse"
                    >
                      <td className="px-4 py-3 sm:px-5">
                        <div className="flex items-center space-x-3">
                          <div className="size-9 rounded-full bg-slate-200 dark:bg-navy-500" />
                          <div className="h-4 w-28 rounded bg-slate-200 dark:bg-navy-500" />
                        </div>
                      </td>
                      <td className="px-4 py-3 sm:px-5">
                        <div className="h-4 w-24 rounded bg-slate-200 dark:bg-navy-500" />
                      </td>
                      <td className="px-4 py-3 sm:px-5">
                        <div className="h-4 w-32 rounded bg-slate-200 dark:bg-navy-500" />
                      </td>
                      <td className="px-4 py-3 sm:px-5">
                        <div className="h-4 w-20 rounded bg-slate-200 dark:bg-navy-500" />
                      </td>
                      <td className="px-4 py-3 sm:px-5">
                        <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-navy-500" />
                      </td>
                    </tr>
                  ))
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-slate-500 dark:text-navy-300"
                    >
                      No appointments found.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`border-y border-transparent ${
                        index === filteredData.length - 1
                          ? ""
                          : "border-b-slate-200 dark:border-b-navy-500"
                      }`}
                    >
                      <td
                        className={`whitespace-nowrap px-4 py-3 sm:px-5 ${
                          index === filteredData.length - 1
                            ? "rounded-bl-lg"
                            : ""
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="avatar size-9">
                            <Image
                              className="rounded-full"
                              src="/images/200x200.png"
                              alt="avatar"
                              width={36}
                              height={36}
                            />
                          </div>
                          <span className="font-medium text-slate-700 dark:text-navy-100">
                            {item.patientName}
                          </span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                        {item.doctorName}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-600 dark:text-navy-100 sm:px-5">
                        {formatTodayOrDate(item.scheduledAt)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                        {getStatusBadge(item.status)}
                      </td>
                      <td
                        className={`whitespace-nowrap px-4 py-3 sm:px-5 ${
                          index === filteredData.length - 1
                            ? "rounded-br-lg"
                            : ""
                        }`}
                      >
                        <div className="flex justify-end">
                          <Link
                            href={`/patient-preview?appointmentId=${item.id}&patientId=${item.patientId}`}
                            className="flex size-8 items-center justify-center rounded-full bg-slate-150 text-slate-600 transition-colors hover:bg-slate-200 active:bg-slate-200/80 dark:bg-navy-500 dark:text-navy-200 dark:hover:bg-navy-450"
                            title="View patient"
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
                                d="M7 17L17 7M17 7H7M17 7v10"
                              />
                            </svg>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
