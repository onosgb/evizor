"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "../stores/authStore";
import { useAppointmentStore } from "../stores/appointmentStore";
import { AppointmentStatus } from "../models";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const accessToken = useAuthStore((state) => state.accessToken);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const addLiveQueueItem = useAppointmentStore((state) => state.addLiveQueueItem);
  const updateAppointmentStatus = useAppointmentStore((state) => state.updateAppointmentStatus);

  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
    // Assuming the signaling gateway is at the base URL (removing /api if present)
    
    const newSocket = io(`${socketUrl}`, {
      auth: {
        token: accessToken,
      },
      transports: ["websocket"],
    });

    newSocket.on("connect", () => {
      setIsConnected(true);
      newSocket.emit("register");
    });

    newSocket.on("registered", (data) => {
      console.log("Successfully registered on signaling gateway:", data.role);
    });

    newSocket.on("appointment:created", (appointment) => {
      addLiveQueueItem(appointment);
    });

    newSocket.on("appointment:attended", (data: { appointmentId: string }) => {
      if (data.appointmentId) {
        updateAppointmentStatus(data.appointmentId, AppointmentStatus.PROGRESS);
      }
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
    });

    newSocket.on("error", (err) => {
      console.error("Signaling Gateway Error:", err);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [isAuthenticated, accessToken, addLiveQueueItem, updateAppointmentStatus]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
