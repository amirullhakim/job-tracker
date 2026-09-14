import {
  useEffect,
  useState,
} from "react";

import {
  BriefcaseBusiness,
  CalendarCheck,
  CircleCheckBig,
  CircleX,
  Plus,
} from "lucide-react";

import { Link } from "react-router-dom";

import { getDashboard } from "../api/applications";

import { useAuth } from "../auth/AuthContext";

import StatusBadge from "../components/StatusBadge";

import {
  APPLICATION_STATUSES,
} from "../types/application";

import type { DashboardData } from "../types/application";

export default function DashboardPage() {
  const { user } = useAuth();

  const [data, setData] =
    useState<DashboardData | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] = useState("");

  const firstName =
    user?.name?.split(" ")[0] ||
    "there";

  useEffect(() => {
    async function loadDashboard() {
      try {
        const dashboard =
          await getDashboard();

        setData(dashboard);
      } catch {
        setError(
          "Could not load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  function formatDate(value: string) {
    return new Date(
      value
    ).toLocaleDateString("en-MY", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  const cards = [
    {
      label: "Total Applications",
      value: data?.total || 0,
      icon: BriefcaseBusiness,
    },

    {
      label: "Interviews",
      value: data?.interviews || 0,
      icon: CalendarCheck,
    },

    {
      label: "Offers",
      value: data?.offers || 0,
      icon: CircleCheckBig,
    },

    {
      label: "Rejected",
      value: data?.rejected || 0,
      icon: CircleX,
    },
  ];

  return (
    <div className="pb-24 lg:pb-0">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-[#1B7A89]">
            Dashboard
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#172B4D] sm:text-3xl">
            Good morning, {firstName}
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Here's an overview of your job
            applications.
          </p>
        </div>

        <Link
        to="/applications/new"
        style={{ color: "#FFFFFF" }}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#172B4D] px-5 py-3 text-sm font-semibold shadow-sm transition hover:bg-[#213B66] hover:shadow-md"
        >
        <Plus size={17} color="#FFFFFF" />
        <span className="text-white">Add application</span>
        </Link>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    {card.label}
                  </p>

                  <p className="mt-3 text-3xl font-semibold text-[#172B4D]">
                    {loading
                      ? "—"
                      : card.value}
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#DDF7F8] text-[#1B7A89]">
                  <Icon size={20} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-[#172B4D]">
              Recent applications
            </h2>

            <Link
              to="/applications"
              className="text-sm font-medium text-[#1B7A89]"
            >
              View all
            </Link>
          </div>

          {loading ? (
            <div className="flex min-h-56 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#DDF7F8] border-t-[#172B4D]" />
            </div>
          ) : data?.recent.length ? (
            <div className="mt-5 divide-y divide-slate-100">
              {data.recent.map(
                (application) => (
                  <Link
                    key={application.id}
                    to={`/applications/${application.id}`}
                    className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-[#172B4D]">
                        {
                          application.position
                        }
                      </p>

                      <p className="mt-1 truncate text-xs text-gray-400">
                        {
                          application.companyName
                        }{" "}
                        ·{" "}
                        {formatDate(
                          application.dateApplied
                        )}
                      </p>
                    </div>

                    <StatusBadge
                      status={
                        application.status
                      }
                    />
                  </Link>
                )
              )}
            </div>
          ) : (
            <div className="flex min-h-56 items-center justify-center">
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F3FCFC] text-[#1B7A89]">
                  <BriefcaseBusiness
                    size={22}
                  />
                </div>

                <p className="mt-4 text-sm font-medium text-[#172B4D]">
                  No applications yet
                </p>

                <Link
                  to="/applications/new"
                  className="mt-2 inline-block text-sm font-medium text-[#1B7A89]"
                >
                  Add your first application
                </Link>
              </div>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-[#172B4D]">
            Status overview
          </h2>

          <div className="mt-5 space-y-4">
            {APPLICATION_STATUSES.map(
              (status) => {
                const count =
                  data?.statusCounts[
                    status
                  ] || 0;

                const percentage =
                  data?.total
                    ? Math.round(
                        (count /
                          data.total) *
                          100
                      )
                    : 0;

                return (
                  <div key={status}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        {status}
                      </span>

                      <span className="font-medium text-[#172B4D]">
                        {count}
                      </span>
                    </div>

                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-[#47C6CE]"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </section>
      </div>
    </div>
  );
}