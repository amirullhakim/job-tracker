import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  BriefcaseBusiness,
  Eye,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  deleteApplication,
  getApplications,
} from "../api/applications";

import StatusBadge from "../components/StatusBadge";
import ConfirmModal from "../components/ConfirmModal";
import { useToast } from "../components/ToastProvider";

import {
  APPLICATION_STATUSES,
  EMPLOYMENT_TYPES,
  PLATFORMS,
  WORK_MODES,
} from "../types/application";

import type { Application } from "../types/application";

export default function ApplicationsPage() {
  const navigate = useNavigate();

  const { showToast } = useToast();

  const [applications, setApplications] =
    useState<Application[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [workMode, setWorkMode] =
    useState("");

  const [
    employmentType,
    setEmploymentType,
  ] = useState("");

  const [platform, setPlatform] =
    useState("");

  const [sort, setSort] =
    useState("newest");

  const [
    deleteTarget,
    setDeleteTarget,
  ] = useState<Application | null>(
    null
  );

  const [deleting, setDeleting] =
    useState(false);

  useEffect(() => {
    loadApplications();
  }, []);

  async function loadApplications() {
    try {
      setLoading(true);
      setError("");

      const data =
        await getApplications();

      setApplications(data);
    } catch {
      setError(
        "Could not load your applications."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleDelete(
    application: Application
  ) {
    setDeleteTarget(application);
  }

  async function confirmDelete() {
    if (!deleteTarget) {
      return;
    }

    try {
      setDeleting(true);

      await deleteApplication(
        deleteTarget.id
      );

      setApplications((current) =>
        current.filter(
          (application) =>
            application.id !==
            deleteTarget.id
        )
      );

      showToast(
        "Application deleted successfully.",
        "success"
      );

      setDeleteTarget(null);
    } catch {
      showToast(
        "Could not delete the application.",
        "error"
      );
    } finally {
      setDeleting(false);
    }
  }

  function resetFilters() {
    setSearch("");
    setStatus("");
    setWorkMode("");
    setEmploymentType("");
    setPlatform("");
    setSort("newest");
  }

  const filteredApplications =
    useMemo(() => {
      const normalizedSearch =
        search.trim().toLowerCase();

      const result =
        applications.filter(
          (application) => {
            const matchesSearch =
              !normalizedSearch ||
              application.companyName
                .toLowerCase()
                .includes(
                  normalizedSearch
                ) ||
              application.position
                .toLowerCase()
                .includes(
                  normalizedSearch
                );

            const matchesStatus =
              !status ||
              application.status ===
                status;

            const matchesWorkMode =
              !workMode ||
              application.workMode ===
                workMode;

            const matchesEmployment =
              !employmentType ||
              application.employmentType ===
                employmentType;

            const matchesPlatform =
              !platform ||
              application.platform ===
                platform;

            return (
              matchesSearch &&
              matchesStatus &&
              matchesWorkMode &&
              matchesEmployment &&
              matchesPlatform
            );
          }
        );

      result.sort((a, b) => {
        if (sort === "oldest") {
          return (
            new Date(
              a.dateApplied
            ).getTime() -
            new Date(
              b.dateApplied
            ).getTime()
          );
        }

        if (sort === "company-az") {
          return a.companyName.localeCompare(
            b.companyName
          );
        }

        if (sort === "company-za") {
          return b.companyName.localeCompare(
            a.companyName
          );
        }

        return (
          new Date(
            b.dateApplied
          ).getTime() -
          new Date(
            a.dateApplied
          ).getTime()
        );
      });

      return result;
    }, [
      applications,
      search,
      status,
      workMode,
      employmentType,
      platform,
      sort,
    ]);

  function formatDate(
    value: string
  ) {
    return new Date(
      value
    ).toLocaleDateString("en-MY", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div className="pb-24 lg:pb-0">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-[#1B7A89]">
            Applications
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#172B4D] sm:text-3xl">
            Job Applications
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Keep every opportunity organised
            in one place.
          </p>
        </div>

        <Link
          to="/applications/new"
          style={{
            color: "#FFFFFF",
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#172B4D] px-5 py-3 text-sm font-semibold shadow-sm transition hover:bg-[#213B66] hover:shadow-md"
        >
          <Plus
            size={18}
            color="#FFFFFF"
          />

          <span className="text-white">
            Add application
          </span>
        </Link>
      </div>

      <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search company or position..."
            className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#47C6CE] focus:ring-4 focus:ring-[#DDF7F8]"
          />
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <select
            value={status}
            onChange={(event) =>
              setStatus(
                event.target.value
              )
            }
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none"
          >
            <option value="">
              All statuses
            </option>

            {APPLICATION_STATUSES.map(
              (item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              )
            )}
          </select>

          <select
            value={workMode}
            onChange={(event) =>
              setWorkMode(
                event.target.value
              )
            }
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none"
          >
            <option value="">
              All work modes
            </option>

            {WORK_MODES.map(
              (item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              )
            )}
          </select>

          <select
            value={employmentType}
            onChange={(event) =>
              setEmploymentType(
                event.target.value
              )
            }
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none"
          >
            <option value="">
              All employment
            </option>

            {EMPLOYMENT_TYPES.map(
              (item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              )
            )}
          </select>

          <select
            value={platform}
            onChange={(event) =>
              setPlatform(
                event.target.value
              )
            }
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none"
          >
            <option value="">
              All platforms
            </option>

            {PLATFORMS.map(
              (item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              )
            )}
          </select>

          <select
            value={sort}
            onChange={(event) =>
              setSort(
                event.target.value
              )
            }
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none"
          >
            <option value="newest">
              Newest first
            </option>

            <option value="oldest">
              Oldest first
            </option>

            <option value="company-az">
              Company A–Z
            </option>

            <option value="company-za">
              Company Z–A
            </option>
          </select>
        </div>

        {(search ||
          status ||
          workMode ||
          employmentType ||
          platform ||
          sort !== "newest") && (
          <button
            onClick={resetFilters}
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#172B4D]"
          >
            <X size={16} />
            Reset filters
          </button>
        )}
      </div>

      {error && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-5 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {
            filteredApplications.length
          }{" "}
          {filteredApplications.length ===
          1
            ? "application"
            : "applications"}
        </p>
      </div>

      {loading ? (
        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[#DDF7F8] border-t-[#172B4D]" />

          <p className="mt-4 text-sm text-gray-500">
            Loading applications...
          </p>
        </div>
      ) : filteredApplications.length ===
        0 ? (
        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#DDF7F8] text-[#1B7A89]">
            <BriefcaseBusiness
              size={23}
            />
          </div>

          <h2 className="mt-4 font-semibold text-[#172B4D]">
            No applications found
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
            Add your first job application
            or adjust the filters.
          </p>
        </div>
      ) : (
        <>
          {/* DESKTOP TABLE */}

          <div className="mt-5 hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-slate-100 bg-slate-50/70">
                  <tr className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    <th className="px-5 py-4">
                      Company
                    </th>

                    <th className="px-5 py-4">
                      Position
                    </th>

                    <th className="px-5 py-4">
                      Date
                    </th>

                    <th className="px-5 py-4">
                      Status
                    </th>

                    <th className="px-5 py-4">
                      Work mode
                    </th>

                    <th className="px-5 py-4 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredApplications.map(
                    (application) => (
                      <tr
                        key={
                          application.id
                        }
                        className="transition hover:bg-slate-50/60"
                      >
                        <td className="px-5 py-4">
                          <p className="font-medium text-[#172B4D]">
                            {
                              application.companyName
                            }
                          </p>

                          {application.location && (
                            <p className="mt-1 text-xs text-gray-400">
                              {
                                application.location
                              }
                            </p>
                          )}
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-600">
                          {
                            application.position
                          }
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-500">
                          {formatDate(
                            application.dateApplied
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge
                            status={
                              application.status
                            }
                          />
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-500">
                          {application.workMode ||
                            "—"}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-1">
                            <button
                              type="button"
                              onClick={() =>
                                navigate(
                                  `/applications/${application.id}`
                                )
                              }
                              className="rounded-lg p-2 text-gray-400 transition hover:bg-[#F3FCFC] hover:text-[#1B7A89]"
                              title="View"
                            >
                              <Eye
                                size={
                                  17
                                }
                              />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                navigate(
                                  `/applications/${application.id}/edit`
                                )
                              }
                              className="rounded-lg p-2 text-gray-400 transition hover:bg-blue-50 hover:text-blue-600"
                              title="Edit"
                            >
                              <Pencil
                                size={
                                  17
                                }
                              />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  application
                                )
                              }
                              className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                              title="Delete"
                            >
                              <Trash2
                                size={
                                  17
                                }
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* MOBILE CARDS */}

          <div className="mt-5 space-y-3 md:hidden">
            {filteredApplications.map(
              (application) => (
                <div
                  key={
                    application.id
                  }
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-[#172B4D]">
                        {
                          application.companyName
                        }
                      </p>

                      <p className="mt-1 text-sm text-gray-600">
                        {
                          application.position
                        }
                      </p>
                    </div>

                    <StatusBadge
                      status={
                        application.status
                      }
                    />
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-gray-500">
                    <div>
                      <p className="text-gray-400">
                        Applied
                      </p>

                      <p className="mt-1 text-gray-600">
                        {formatDate(
                          application.dateApplied
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-400">
                        Work mode
                      </p>

                      <p className="mt-1 text-gray-600">
                        {application.workMode ||
                          "—"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/applications/${application.id}`
                        )
                      }
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#F3FCFC] px-3 py-2.5 text-sm font-medium text-[#1B7A89]"
                    >
                      <Eye size={16} />
                      View
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/applications/${application.id}/edit`
                        )
                      }
                      className="rounded-xl border border-slate-200 p-2.5 text-gray-500"
                    >
                      <Pencil
                        size={16}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          application
                        )
                      }
                      className="rounded-xl border border-slate-200 p-2.5 text-red-500"
                    >
                      <Trash2
                        size={16}
                      />
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </>
      )}

      <ConfirmModal
        open={Boolean(
          deleteTarget
        )}
        title="Delete application?"
        description={
          deleteTarget
            ? `This will permanently delete your application for ${deleteTarget.position} at ${deleteTarget.companyName}. This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete application"
        loading={deleting}
        onCancel={() =>
          setDeleteTarget(null)
        }
        onConfirm={confirmDelete}
      />
    </div>
  );
}