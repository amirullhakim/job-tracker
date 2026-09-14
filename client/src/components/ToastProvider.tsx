import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import type { ReactNode } from "react";

import {
  AlertCircle,
  CheckCircle2,
  Info,
  X,
} from "lucide-react";

type ToastType =
  | "success"
  | "error"
  | "info";

interface ToastData {
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (
    message: string,
    type?: ToastType
  ) => void;
}

const ToastContext = createContext<
  ToastContextValue | undefined
>(undefined);

export function ToastProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [toast, setToast] =
    useState<ToastData | null>(null);

  const timerRef =
    useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(
          timerRef.current
        );
      }
    };
  }, []);

  function showToast(
    message: string,
    type: ToastType = "success"
  ) {
    if (timerRef.current) {
      window.clearTimeout(
        timerRef.current
      );
    }

    setToast({
      message,
      type,
    });

    timerRef.current =
      window.setTimeout(() => {
        setToast(null);
      }, 3000);
  }

  const styles = {
    success:
      "border-emerald-200 bg-white text-emerald-700 dark:border-emerald-900 dark:bg-slate-900 dark:text-emerald-300",

    error:
      "border-red-200 bg-white text-red-600 dark:border-red-900 dark:bg-slate-900 dark:text-red-300",

    info:
      "border-blue-200 bg-white text-blue-700 dark:border-blue-900 dark:bg-slate-900 dark:text-blue-300",
  };

  function ToastIcon() {
    if (toast?.type === "error") {
      return <AlertCircle size={19} />;
    }

    if (toast?.type === "info") {
      return <Info size={19} />;
    }

    return <CheckCircle2 size={19} />;
  }

  return (
    <ToastContext.Provider
      value={{
        showToast,
      }}
    >
      {children}

      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-[100] flex max-w-sm items-center gap-3 rounded-2xl border px-4 py-3 shadow-xl ${styles[toast.type]}`}
        >
          <ToastIcon />

          <p className="text-sm font-medium">
            {toast.message}
          </p>

          <button
            type="button"
            onClick={() =>
              setToast(null)
            }
            className="ml-2 rounded-lg p-1 opacity-60 transition hover:bg-black/5 hover:opacity-100 dark:hover:bg-white/10"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context =
    useContext(ToastContext);

  if (!context) {
    throw new Error(
      "useToast must be used inside ToastProvider."
    );
  }

  return context;
}