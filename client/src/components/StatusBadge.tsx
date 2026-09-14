interface StatusBadgeProps {
  status: string;
}

const statusClasses: Record<
  string,
  string
> = {
  Saved:
    "bg-slate-100 text-slate-600",

  Applied:
    "bg-blue-50 text-blue-700",

  Screening:
    "bg-cyan-50 text-cyan-700",

  Assessment:
    "bg-violet-50 text-violet-700",

  Interview:
    "bg-amber-50 text-amber-700",

  Offer:
    "bg-emerald-50 text-emerald-700",

  Rejected:
    "bg-red-50 text-red-600",

  Withdrawn:
    "bg-gray-100 text-gray-500",
};

export default function StatusBadge({
  status,
}: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
        statusClasses[status] ||
        "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}