"use client";

import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { NexIcon } from "./NexMascot";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

let toastId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const COLORS = {
    success: "border-green-500 bg-green-950/90",
    error: "border-red-500 bg-red-950/90",
    info: "border-indigo-500 bg-indigo-950/90",
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed top-16 right-4 z-[100] space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-2 border-2 ${COLORS[toast.type]} px-4 py-2.5 pixel-shadow animate-[slideIn_0.2s_ease-out]`}
            style={{ minWidth: 200 }}
          >
            <NexIcon size={16} />
            <span className="font-pixel text-[7px] text-white">{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
