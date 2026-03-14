"use client";

import { useEffect, useRef, memo, useMemo } from "react";
import {
  RealtimeKitProvider,
  useRealtimeKitSelector,
} from "@cloudflare/realtimekit-react";

import RealtimeKitClient from "@cloudflare/realtimekit";

// Local video container
const LocalVideo = () => {
  const videoTrack = useRealtimeKitSelector((m) => m.self.videoTrack);
  const audioTrack = useRealtimeKitSelector((m) => m.self.audioTrack);

  useEffect(() => {
    const videoElement = document.getElementById(
      "rtk-local-video",
    ) as HTMLVideoElement;
    if (videoElement && videoTrack) {
      const stream = new MediaStream();
      stream.addTrack(videoTrack);
      if (audioTrack) {
        stream.addTrack(audioTrack);
      }
      videoElement.srcObject = stream;
    }
  }, [videoTrack, audioTrack]);

  return (
    <div className="absolute bottom-4 right-4 w-40 h-56 bg-black rounded-lg overflow-hidden border-2 border-slate-700 shadow-xl z-20">
      <video
        id="rtk-local-video"
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover mirror"
      />
    </div>
  );
};

// Remote participants container
const RemoteVideos = ({
  patientDisplayName,
}: {
  patientDisplayName: string;
}) => {
  // Check both active and joined — SDK sometimes populates one before the other
  const activeParticipants = useRealtimeKitSelector(
    (m) => m.participants.active,
  );
  const joinedParticipants = useRealtimeKitSelector(
    (m) => m.participants.joined,
  );
  const selfId = useRealtimeKitSelector((m) => m.self.id);

  // Merge active + joined, deduplicate by id, exclude self
  const participantsArray = useMemo(() => {
    const map = new Map(joinedParticipants);
    activeParticipants.forEach((p, id) => {
      if (!map.has(id)) map.set(id, p);
    });
    return Array.from(map.values()).filter((p) => p.id !== selfId);
  }, [activeParticipants, joinedParticipants, selfId]);

  // Log when someone joins the room (for debugging same-meeting issues)
  const prevIdsRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    const ids = new Set(participantsArray.map((p) => p.id));
    const prev = prevIdsRef.current;
    if (ids.size !== prev.size || [...ids].some((id) => !prev.has(id))) {
      console.log(
        "[Consultation] [WEB] Remote participants:",
        participantsArray.length,
        participantsArray.map((p) => `${p.name ?? "?"} (id=${p.id})`),
      );
      participantsArray.forEach((p) => {
        if (!prev.has(p.id)) {
          console.log(
            "[Consultation] [WEB] Someone joined the room:",
            p.name ?? "Participant",
            `(id=${p.id})`,
          );
        }
      });
      prevIdsRef.current = ids;
    }
  }, [participantsArray]);

  useEffect(() => {
    participantsArray.forEach((p) => {
      const videoElement = document.getElementById(
        `rtk-remote-video-${p.id}`,
      ) as HTMLVideoElement;
      if (videoElement) {
        const stream = new MediaStream();
        if (p.videoTrack) stream.addTrack(p.videoTrack);
        if (p.audioTrack) stream.addTrack(p.audioTrack);
        if (stream.getTracks().length > 0) {
          videoElement.srcObject = stream;
        }
      }
    });
  }, [participantsArray]);

  if (participantsArray.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full text-white/50">
        <p>Waiting for {patientDisplayName} to join...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 align-center justify-center h-full w-full">
      {participantsArray.map((p) => (
        <div
          key={p.id}
          className="relative w-full h-full flex items-center justify-center"
        >
          <video
            id={`rtk-remote-video-${p.id}`}
            autoPlay
            playsInline
            className="max-w-full max-h-full object-contain"
          />
        </div>
      ))}
    </div>
  );
};

interface VideoSectionProps {
  meeting: RealtimeKitClient | null;
  error: string | null;
  patientDisplayName: string;
  displayPatientId: string;
  onEndCall: () => void;
  onRetry: () => void;
}

export const VideoSection = memo(function VideoSection({
  meeting,
  error,
  patientDisplayName,
  displayPatientId,
  onEndCall,
  onRetry,
}: VideoSectionProps) {
  return (
    <section className="flex flex-col flex-1 min-w-0 w-full lg:max-w-[55%] bg-white rounded-2xl shadow-md pt-2 pb-4 px-4 lg:pt-3 lg:pb-6 lg:px-6 relative h-full min-h-0 overflow-hidden">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-1.5">
        <div>
          <h2 className="text-xl font-semibold">
            Consultation with {patientDisplayName}
          </h2>
          <p className="text-sm text-gray-500">
            Patient ID: {displayPatientId}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="px-3 py-1 text-sm bg-green-100 text-green-600 rounded-full animate-pulse">
            Live
          </span>
          <button
            onClick={onEndCall}
            className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-sm font-medium transition-colors"
          >
            End Session
          </button>
        </div>
      </div>

      {/* Video Container */}
      <div className="relative flex-1 min-h-0 bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center">
        {error ? (
          <div className="w-full px-5 py-6 max-w-lg rounded-2xl bg-red-900/70 border border-red-500/30 shadow-lg backdrop-blur">
            <div className="flex items-start gap-3">
              <div className="mt-1 rounded-full bg-red-500/20 p-2 text-red-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.366-.746 1.4-.746 1.766 0l6.523 13.307c.35.714-.232 1.594-.883 1.594H2.617c-.651 0-1.233-.88-.883-1.594L8.257 3.1zM10 12a1 1 0 100 2 1 1 0 000-2zm-.75-4a.75.75 0 011.5 0v3a.75.75 0 01-1.5 0V8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-base font-semibold text-red-100">
                  Call session error
                </p>
                <p className="mt-1 text-sm text-red-200">{error}</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                onClick={onRetry}
                className="w-full px-3 py-2 bg-white text-slate-900 rounded-lg font-medium hover:bg-slate-100 transition"
              >
                Retry
              </button>
              <button
                onClick={onEndCall}
                className="w-full cursor-pointer px-3 py-2 bg-transparent border border-white/60 text-white rounded-lg hover:bg-white/10 transition"
              >
                End Meeting
              </button>
            </div>
            <p className="mt-3 text-xs cursor-pointer text-red-200 opacity-80">
              If the issue persists, refresh the page or check your network.
            </p>
          </div>
        ) : !meeting ? (
          <div className="flex flex-col items-center text-white space-y-4">
            <svg
              className="w-10 h-10 animate-spin text-white opacity-80"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p>Starting video feed...</p>
          </div>
        ) : (
          <RealtimeKitProvider value={meeting}>
            <div className="relative flex-1 w-full h-full bg-slate-900 overflow-hidden rounded-2xl">
              <RemoteVideos patientDisplayName={patientDisplayName} />
              <LocalVideo />
            </div>
          </RealtimeKitProvider>
        )}
      </div>

      {/* Transcript (Mocked) */}
      <div className="mt-2 p-3 bg-gray-50 rounded-xl text-sm text-gray-600">
        Doctor: “Can you describe the pain you’re experiencing?”
      </div>
    </section>
  );
});
