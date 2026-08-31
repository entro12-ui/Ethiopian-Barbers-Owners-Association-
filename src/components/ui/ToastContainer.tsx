"use client";

import { cn } from "@/lib/utils";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { Toast, ToastType } from "@/hooks/useToast";

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

const icons: Record<ToastType, typeof CheckCircle> = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const styles: Record<ToastType, string> = {
  success: "border-green-500/50 bg-green-950/90 text-green-100",
  error: "border-red-500/50 bg-red-950/90 text-red-100",
  info: "border-gold/50 bg-charcoal/95 text-white",
};

export default function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm">
      {toasts.map((toast) => {
        const Icon = icons[toast.type];
        return (
          <div
            key={toast.id}
            className={cn(
              "flex items-start gap-3 p-4 rounded-sm border backdrop-blur-sm shadow-xl animate-slide-up",
              styles[toast.type]
            )}
          >
            <Icon className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm flex-1">{toast.message}</p>
            <button
              onClick={() => onDismiss(toast.id)}
              className="shrink-0 hover:opacity-70 transition-opacity"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
