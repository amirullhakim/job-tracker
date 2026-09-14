import {
  AlertTriangle,
  X,
} from "lucide-react";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  loading?: boolean;

  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = "Delete",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 px-5 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-500 dark:bg-red-950/40">
            <AlertTriangle size={21} />
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-slate-100 hover:text-gray-600 dark:hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        <h2 className="mt-5 text-lg font-semibold text-[#172B4D] dark:text-slate-100">
          {title}
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-slate-400">
          {description}
        </p>

        <div className="mt-7 flex justify-end gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={onCancel}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            style={{
              color: "#FFFFFF",
            }}
            className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="text-white">
              {loading
                ? "Deleting..."
                : confirmLabel}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}