"use client";

import { useState } from "react";
import { useAuthStore } from "../stores/authStore";
import { createPortal } from "react-dom";
import ProfileSidebar from "./ProfileSidebar";

interface Document {
  id: number;
  name: string;
  timestamp: string;
}

export default function QualificationsContent() {
  const user = useAuthStore((state) => state.user);
  const [showModal, setShowModal] = useState(false);
  const [documents] = useState<Document[]>([
    { id: 1, name: "Cy Ganderton", timestamp: "Quality Control Specialist" },
    { id: 2, name: "Hart Hagerty", timestamp: "Desktop Support Technician" },
    { id: 3, name: "Brice Swyre", timestamp: "Tax Accountant" },
    { id: 4, name: "Marjy Ferencz", timestamp: "Office Assistant I" },
  ]);

  const [uploadFormData, setUploadFormData] = useState({
    category: "",
    description: "",
    websiteAddress: "",
    publicPin: false,
  });

  const handleUploadFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setUploadFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleUpload = () => {
    // TODO: Implement upload functionality
    console.log("Uploading document:", uploadFormData);
    setShowModal(false);
    // Reset form
    setUploadFormData({
      category: "",
      description: "",
      websiteAddress: "",
      publicPin: false,
    });
  };

  const handleViewDocument = (id: number) => {
    // TODO: Implement view functionality
    console.log("Viewing document:", id);
  };

  const handleDeleteDocument = (id: number) => {
    // TODO: Implement delete functionality
    console.log("Deleting document:", id);
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6">
        {/* Sidebar Navigation */}
      <ProfileSidebar />
       
        {/* Main Content */}
        <div className="col-span-12 lg:col-span-8">
          <div className="card">
            <div className="flex flex-col items-center space-y-4 border-b border-slate-200 p-4 dark:border-navy-500 sm:flex-row sm:justify-between sm:space-y-0 sm:px-5">
              <h2 className="text-lg font-medium tracking-wide text-slate-700 dark:text-navy-100">
                Qualifications & Documents
              </h2>
              <div className="flex justify-center space-x-2">
                <button
                  onClick={() => setShowModal(true)}
                  className="btn min-w-28 rounded-full bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
                >
                  Upload New Document
                </button>
              </div>
            </div>
            <div className="p-4 sm:p-5">
              <div className="is-scrollbar-hidden min-w-full overflow-x-auto">
                <table className="is-zebra w-full text-left">
                  <thead>
                    <tr>
                      <th className="whitespace-nowrap rounded-l-lg bg-slate-200 px-3 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                        #
                      </th>
                      <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                        Name
                      </th>
                      <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                        TimeStamp
                      </th>
                      <th className="whitespace-nowrap rounded-r-lg bg-slate-200 px-3 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((doc) => (
                      <tr key={doc.id}>
                        <td className="whitespace-nowrap rounded-l-lg px-4 py-3 sm:px-5">
                          {doc.id}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 sm:px-5">{doc.name}</td>
                        <td className="whitespace-nowrap px-4 py-3 sm:px-5">{doc.timestamp}</td>
                        <td className="whitespace-nowrap rounded-r-lg px-4 py-3 sm:px-5">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => handleViewDocument(doc.id)}
                              className="btn size-8 p-0 text-info hover:bg-info/20 focus:bg-info/20 active:bg-info/25"
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
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteDocument(doc.id)}
                              className="btn size-8 p-0 text-error hover:bg-error/20 focus:bg-error/20 active:bg-error/25"
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
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Document Modal */}
      {showModal &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-100 flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
            role="dialog"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowModal(false);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setShowModal(false);
              }
            }}
          >
            <div
              className="absolute inset-0 bg-slate-900/60 transition-opacity duration-300"
              onClick={() => setShowModal(false)}
            ></div>
            <div className="relative w-full max-w-lg origin-top rounded-lg bg-white transition-all duration-300 dark:bg-navy-700">
              <div className="flex justify-between rounded-t-lg bg-slate-200 px-4 py-3 dark:bg-navy-800 sm:px-5">
                <h3 className="text-base font-medium text-slate-700 dark:text-navy-100">
                  Upload New Document
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="btn -mr-1.5 size-7 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-4.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="px-4 py-4 sm:px-5">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda incidunt
                </p>
                <div className="mt-4 space-y-4">
                  <label className="block">
                    <span>Choose category :</span>
                    <select
                      name="category"
                      value={uploadFormData.category}
                      onChange={handleUploadFormChange}
                      className="form-select mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent"
                    >
                      <option value="">Select category</option>
                      <option value="laravel">Laravel</option>
                      <option value="nodejs">Node JS</option>
                      <option value="django">Django</option>
                      <option value="other">Other</option>
                    </select>
                  </label>
                  <label className="block">
                    <span>Description:</span>
                    <textarea
                      name="description"
                      value={uploadFormData.description}
                      onChange={handleUploadFormChange}
                      rows={4}
                      placeholder=" Enter Text"
                      className="form-textarea mt-1.5 w-full resize-none rounded-lg border border-slate-300 bg-transparent p-2.5 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                    ></textarea>
                  </label>
                  <label className="block">
                    <span>Website Address:</span>
                    <input
                      name="websiteAddress"
                      value={uploadFormData.websiteAddress}
                      onChange={handleUploadFormChange}
                      className="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                      placeholder="URL Address"
                      type="text"
                    />
                  </label>
                  <label className="inline-flex items-center space-x-2">
                    <input
                      name="publicPin"
                      type="checkbox"
                      checked={uploadFormData.publicPin}
                      onChange={handleUploadFormChange}
                      className="form-switch is-outline h-5 w-10 rounded-full border border-slate-400/70 bg-transparent before:rounded-full before:bg-slate-300 checked:border-primary checked:before:bg-primary dark:border-navy-400 dark:before:bg-navy-300 dark:checked:border-accent dark:checked:before:bg-accent"
                    />
                    <span>Public pin</span>
                  </label>
                  <div className="space-x-2 text-right">
                    <button
                      onClick={() => setShowModal(false)}
                      className="btn min-w-28 rounded-full border border-slate-300 font-medium text-slate-800 hover:bg-slate-150 focus:bg-slate-150 active:bg-slate-150/80 dark:border-navy-450 dark:text-navy-50 dark:hover:bg-navy-500 dark:focus:bg-navy-500 dark:active:bg-navy-500/90"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpload}
                      className="btn min-w-28 rounded-full bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
