"use client";
import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { X, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const ToastProvider = ToastPrimitive.Provider;

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={cn(
      "fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-[360px] max-w-[100vw]",
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitive.Viewport.displayName;

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root> & {
    variant?: "default" | "success" | "error";
  }
>(({ className, variant = "default", ...props }, ref) => (
  <ToastPrimitive.Root
    ref={ref}
    className={cn(
      "group pointer-events-auto relative flex items-start gap-3 w-full rounded-xl border p-4 shadow-lg transition-all",
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-80 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-bottom-full",
      {
        "bg-white border-slate-200": variant === "default",
        "bg-emerald-50 border-emerald-200": variant === "success",
        "bg-red-50 border-red-200": variant === "error",
      },
      className
    )}
    {...props}
  />
));
Toast.displayName = ToastPrimitive.Root.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Title
    ref={ref}
    className={cn("text-sm font-semibold text-slate-900", className)}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitive.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Description
    ref={ref}
    className={cn("text-sm text-slate-500 mt-0.5", className)}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitive.Description.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Close
    ref={ref}
    className={cn(
      "absolute top-3 right-3 rounded-md p-0.5 text-slate-400 hover:text-slate-600 transition-colors",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-3.5 w-3.5" />
  </ToastPrimitive.Close>
));
ToastClose.displayName = ToastPrimitive.Close.displayName;

// ── Context-based toast hook ─────────────────────────────────

interface ToastData {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "success" | "error";
}

interface ToastContextValue {
  toast: (data: Omit<ToastData, "id">) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function ToastContextProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastData[]>([]);

  const toast = React.useCallback((data: Omit<ToastData, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...data, id }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      <ToastProvider>
        {children}
        {toasts.map((t) => (
          <Toast key={t.id} open variant={t.variant}>
            <div className="flex items-start gap-2.5 flex-1">
              {t.variant === "success" && <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />}
              {t.variant === "error" && <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />}
              <div>
                <ToastTitle>{t.title}</ToastTitle>
                {t.description && <ToastDescription>{t.description}</ToastDescription>}
              </div>
            </div>
            <ToastClose />
          </Toast>
        ))}
        <ToastViewport />
      </ToastProvider>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastContextProvider");
  return ctx;
}

export { Toast, ToastTitle, ToastDescription, ToastClose, ToastViewport, ToastProvider };
