"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "../stores/authStore";
import { createPortal } from "react-dom";
import ProfileSidebar from "./ProfileSidebar";
import { useQualificationStore } from "../stores/qualificationStore";
import { Qualification } from "../models";

export default function QualificationsContent() {
  const user = useAuthStore((state) => state.user);
  const theme = user?.role === "ADMIN" ? "admin" : "doctor";
  const [showModal, setShowModal] = useState(false);
  const [showViewerModal, setShowViewerModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Qualification | null>(null);

  const {
    qualifications,
    isLoading,
    isUploading,
    uploadError,
    fetchQualifications,
    uploadQualification,
  } = useQualificationStore();

  useEffect(() => {
    fetchQualifications();
  }, [fetchQualifications]);

  const [uploadFormData, setUploadFormData] = useState({
    title: "",
    description: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const handleUploadFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUploadFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      // Validate file type - only PDF and Word documents
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (!validTypes.includes(file.type)) {
        setFileError('Please upload only PDF or Word documents (.pdf, .doc, .docx)');
        setSelectedFile(null);
        return;
      }
    }
    
    setSelectedFile(file);
    setFileError(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setFileError("Please select a file to upload");
      return;
    }
    if (!uploadFormData.title.trim()) {
      return;
    }

    const formData = new FormData();
    formData.append("title", uploadFormData.title);
    formData.append("description", uploadFormData.description);
    formData.append("file", selectedFile);

    const success = await uploadQualification(formData);
    if (success) {
      setShowModal(false);
      setUploadFormData({ title: "", description: "" });
      setSelectedFile(null);
      setFileError(null);
    }
  };

  const handleViewDocument = (id: number) => {
    const document = qualifications.find(q => q.id === id);
    if (document) {
      setSelectedDocument(document);
      setShowViewerModal(true);
    }
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
                  className={`btn min-w-28 rounded-full font-medium text-white ${
                    theme === "admin"
                      ? "bg-success hover:bg-success-focus focus:bg-success-focus active:bg-success-focus/90 dark:bg-success dark:hover:bg-success-focus dark:focus:bg-success-focus dark:active:bg-success/90"
                      : "bg-primary hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
                  }`}
                >
                  Upload New Document
                </button>
              </div>
            </div>
            <div className="p-4 sm:p-5">
              {isLoading ? (
                <div className="flex items-center justify-center py-10">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                </div>
              ) : qualifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-slate-400 dark:text-navy-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="size-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  <p>No documents uploaded yet</p>
                </div>
              ) : (
              <div className="is-scrollbar-hidden min-w-full overflow-x-auto">
                <table className="is-zebra w-full text-left">
                  <thead>
                    <tr>
                      <th className="whitespace-nowrap rounded-l-lg bg-slate-200 px-3 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                        #
                      </th>
                      <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                        Title
                      </th>
                      <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                        Description
                      </th>
                      <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                        Date
                      </th>
                      <th className="whitespace-nowrap rounded-r-lg bg-slate-200 px-3 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {qualifications.map((doc, index) => (
                      <tr key={doc.id}>
                        <td className="whitespace-nowrap rounded-l-lg px-4 py-3 sm:px-5">
                          {index + 1}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 sm:px-5">{doc.title}</td>
                        <td className="whitespace-nowrap px-4 py-3 sm:px-5">{doc.description || "—"}</td>
                        <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                          {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : "—"}
                        </td>
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
              )}
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
                <p className="text-slate-600 dark:text-navy-200">
                  Upload a qualification or document. All fields marked with <span className="text-error">*</span> are required.
                </p>
                {uploadError && (
                  <div className="mt-3 bg-error/10 text-error px-4 py-3 rounded-lg text-center text-sm" role="alert">
                    {uploadError}
                  </div>
                )}
                <div className="mt-4 space-y-4">
                  <label className="block">
                    <span>Document Title <span className="text-error">*</span></span>
                    <input
                      name="title"
                      value={uploadFormData.title}
                      onChange={handleUploadFormChange}
                      className="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                      placeholder="Enter document title"
                      type="text"
                      required
                    />
                  </label>
                  <label className="block">
                    <span>Description</span>
                    <textarea
                      name="description"
                      value={uploadFormData.description}
                      onChange={handleUploadFormChange}
                      rows={3}
                      placeholder="Enter description"
                      className="form-textarea mt-1.5 w-full resize-none rounded-lg border border-slate-300 bg-transparent p-2.5 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                    ></textarea>
                  </label>
                  <div className="block">
                    <span>Attachment <span className="text-error">*</span></span>
                    <label
                      className={`mt-1.5 flex w-full cursor-pointer flex-col items-center rounded-lg border-2 border-dashed px-4 py-6 transition-colors ${
                        fileError
                          ? "border-error bg-error/5"
                          : selectedFile
                          ? "border-success bg-success/5"
                          : "border-slate-300 hover:border-slate-400 dark:border-navy-450 dark:hover:border-navy-400"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`size-8 ${
                          selectedFile ? "text-success" : "text-slate-400 dark:text-navy-300"
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                        />
                      </svg>
                      {selectedFile ? (
                        <p className="mt-2 text-sm font-medium text-success">
                          {selectedFile.name}{" "}
                          <span className="text-slate-400">
                            ({(selectedFile.size / 1024).toFixed(1)} KB)
                          </span>
                        </p>
                      ) : (
                        <p className="mt-2 text-sm text-slate-500 dark:text-navy-300">
                          Click to browse or drag and drop a file
                        </p>
                      )}
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      />
                    </label>
                    {fileError && (
                      <p className="mt-1 text-sm text-error">{fileError}</p>
                    )}
                    <p className="mt-1 text-xs text-slate-400 dark:text-navy-300">
                      Accepted formats: PDF, DOC, DOCX only
                    </p>
                  </div>
                  <div className="space-x-2 text-right">
                    <button
                      onClick={() => {
                        setShowModal(false);
                        setUploadFormData({ title: "", description: "" });
                        setSelectedFile(null);
                        setFileError(null);
                      }}
                      className="btn min-w-28 rounded-full border border-slate-300 font-medium text-slate-800 hover:bg-slate-150 focus:bg-slate-150 active:bg-slate-150/80 dark:border-navy-450 dark:text-navy-50 dark:hover:bg-navy-500 dark:focus:bg-navy-500 dark:active:bg-navy-500/90"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpload}
                      disabled={isUploading}
                      className={`btn min-w-28 rounded-full font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed ${
                    theme === "admin"
                      ? "bg-success hover:bg-success-focus focus:bg-success-focus active:bg-success-focus/90 dark:bg-success dark:hover:bg-success-focus dark:focus:bg-success-focus dark:active:bg-success/90"
                      : "bg-primary hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
                  }`}
                    >
                      {isUploading ? "Uploading..." : "Upload"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Document Viewer Modal */}
      {showViewerModal &&
        selectedDocument &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-100 flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
            role="dialog"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowViewerModal(false);
                setSelectedDocument(null);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setShowViewerModal(false);
                setSelectedDocument(null);
              }
            }}
          >
            <div
              className="absolute inset-0 bg-slate-900/60 transition-opacity duration-300"
              onClick={() => {
                setShowViewerModal(false);
                setSelectedDocument(null);
              }}
            ></div>
            <div className="relative w-full max-w-4xl h-[90vh] origin-top rounded-lg bg-white transition-all duration-300 dark:bg-navy-700 flex flex-col">
              <div className="flex justify-between items-center rounded-t-lg bg-slate-200 px-4 py-3 dark:bg-navy-800 sm:px-5">
                <div>
                  <h3 className="text-base font-medium text-slate-700 dark:text-navy-100">
                    {selectedDocument.title}
                  </h3>
                  {selectedDocument.description && (
                    <p className="text-sm text-slate-500 dark:text-navy-300 mt-1">
                      {selectedDocument.description}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => {
                    setShowViewerModal(false);
                    setSelectedDocument(null);
                  }}
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
              <div className="flex-1 overflow-auto p-4 sm:p-5">
                {selectedDocument.fileType.startsWith('image/') ? (
                  <div className="flex items-center justify-center h-full">
                    <img
                      src={selectedDocument.fileUrl}
                      alt={selectedDocument.title}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                ) : selectedDocument.fileType === 'application/pdf' ? (
                  <iframe
                    src={selectedDocument.fileUrl}
                    className="w-full h-full border-0"
                    title={selectedDocument.title}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-500 dark:text-navy-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-16 mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                      />
                    </svg>
                    <p className="text-lg font-medium mb-2">Preview not available</p>
                    <p className="text-sm mb-4">This file type cannot be previewed in the browser</p>
                    <a
                      href={selectedDocument.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn bg-primary hover:bg-primary-focus text-white rounded-full px-6"
                    >
                      Download File
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
