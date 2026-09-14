import {
  useEffect,
  useState,
} from "react";

import {
  ArrowLeft,
  Building2,
  CalendarDays,
  ExternalLink,
  MapPin,
  Pencil,
  Trash2,
} from "lucide-react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  deleteApplication,
  getApplication,
} from "../api/applications";

import StatusBadge from "../components/StatusBadge";
import ConfirmModal from "../components/ConfirmModal";
import { useToast } from "../components/ToastProvider";

import type { Application } from "../types/application";

export default function ApplicationDetailsPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const { showToast } = useToast();

  const applicationId =
    Number(id);

  const [
    application,
    setApplication,
  ] = useState<Application | null>(
    null
  );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [
    deleteModalOpen,
    setDeleteModalOpen,
  ] = useState(false);

  const [deleting, setDeleting] =
    useState(false);

  useEffect(() => {
    async function loadApplication() {
      if (
        !Number.isInteger(
          applicationId
        )
      ) {
        setError(
          "Invalid application ID."
        );

        setLoading(false);

        return;
      }

      try {
        const data =
          await getApplication(
            applicationId
          );

        setApplication(data);
      } catch {
        setError(
          "Could not load the application."
        );
      } finally {
        setLoading(false);
      }
    }

    loadApplication();
  }, [applicationId]);

  async function handleDelete() {
    if (!application) {
      return;
    }

    try {
      setDeleting(true);

      await deleteApplication(
        application.id
      );

      setDeleteModalOpen(false);

      showToast(
        "Application deleted successfully.",
        "success"
      );

      navigate("/applications");
    } catch {
      showToast(
        "Could not delete the application.",
        "error"
      );
    } finally {
      setDeleting(false);
    }
  }

  function formatDate(
    value: string | null
  ) {
    if (!value) {
      return "—";
    }

    return new Date(
      value
    ).toLocaleDateString("en-MY", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  if (loading) {
    return (
      <div className="flex min-h-72 items-center justify-center">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#DDF7F8] border-t-[#172B4D]" />
      </div>
    );
  }

  if (error || !application) {
    return (
      <div>
        <Link
          to="/applications"
          className="inline-flex items-center gap-2 text-sm text-gray-500"
        >
          <ArrowLeft size={17} />
          Applications
        </Link>

        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {error ||
            "Application not found."}
        </div>
      </div>
    );
  }

  const detailSections = [
    {
      title: "Job description",
      value:
        application.jobDescription,
    },
    {
      title: "Requirements",
      value:
        application.requirements,
    },
    {
      title: "Responsibilities",
      value:
        application.responsibilities,
    },
    {
      title: "Skills",
      value:
        application.skills,
    },
    {
      title: "Remarks",
      value:
        application.remarks,
    },
  ];

  return (
    <div className="pb-24 lg:pb-0">
      <Link
        to="/applications"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-[#172B4D]"
      >
        <ArrowLeft size={17} />
        Applications
      </Link>

      <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold text-[#172B4D] sm:text-3xl">
              {
                application.position
              }
            </h1>

            <StatusBadge
              status={
                application.status
              }
            />
          </div>

          <p className="mt-2 text-lg text-gray-600">
            {
              application.companyName
            }
          </p>

          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500">
            {application.location && (
              <span className="inline-flex items-center gap-2">
                <MapPin
                  size={16}
                />

                {
                  application.location
                }
              </span>
            )}

            <span className="inline-flex items-center gap-2">
              <CalendarDays
                size={16}
              />

              Applied{" "}
              {formatDate(
                application.dateApplied
              )}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            to={`/applications/${application.id}/edit`}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-slate-50"
          >
            <Pencil size={16} />
            Edit
          </Link>

          <button
            type="button"
            onClick={() =>
              setDeleteModalOpen(
                true
              )
            }
            className="inline-flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-100"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>

      <div className="mt-7 grid gap-5 xl:grid-cols-[1fr_0.42fr]">
        <div className="space-y-5">
          {detailSections.map(
            (section) => (
              <section
                key={
                  section.title
                }
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h2 className="font-semibold text-[#172B4D]">
                  {
                    section.title
                  }
                </h2>

                {section.value ? (
                  <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-gray-600">
                    {
                      section.value
                    }
                  </p>
                ) : (
                  <p className="mt-4 text-sm text-gray-400">
                    No information
                    added.
                  </p>
                )}
              </section>
            )
          )}
        </div>

        <aside className="space-y-5">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-[#172B4D]">
              Application information
            </h2>

            <dl className="mt-5 space-y-5">
              <Detail
                label="Company"
                value={
                  application.companyName
                }
              />

              <Detail
                label="Work mode"
                value={
                  application.workMode ||
                  "—"
                }
              />

              <Detail
                label="Employment type"
                value={
                  application.employmentType ||
                  "—"
                }
              />

              <Detail
                label="Platform"
                value={
                  application.platform ||
                  "—"
                }
              />

              <Detail
                label="Salary"
                value={
                  application.salary ||
                  "—"
                }
              />

              <Detail
                label="Follow-up date"
                value={formatDate(
                  application.followUpDate
                )}
              />
            </dl>
          </section>

          {(application.applicationUrl ||
            application.companyUrl) && (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-semibold text-[#172B4D]">
                Links
              </h2>

              <div className="mt-4 space-y-3">
                {application.applicationUrl && (
                  <a
                    href={
                      application.applicationUrl
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-xl bg-[#F3FCFC] px-4 py-3 text-sm font-medium text-[#1B7A89]"
                  >
                    Application page

                    <ExternalLink
                      size={16}
                    />
                  </a>
                )}

                {application.companyUrl && (
                  <a
                    href={
                      application.companyUrl
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium text-gray-600"
                  >
                    Company website

                    <ExternalLink
                      size={16}
                    />
                  </a>
                )}
              </div>
            </section>
          )}

          <div className="rounded-2xl bg-[#172B4D] p-6 text-white">
            <Building2
              size={21}
              className="text-[#A8D8F0]"
            />

            <p className="mt-4 text-sm leading-6 text-blue-100/80">
              Keep this application
              updated as you move
              through each stage.
            </p>
          </div>
        </aside>
      </div>

      <ConfirmModal
        open={deleteModalOpen}
        title="Delete application?"
        description={`This will permanently delete your application for ${application.position} at ${application.companyName}. This action cannot be undone.`}
        confirmLabel="Delete application"
        loading={deleting}
        onCancel={() =>
          setDeleteModalOpen(
            false
          )
        }
        onConfirm={handleDelete}
      />
    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">
        {label}
      </dt>

      <dd className="mt-1.5 text-sm text-gray-700">
        {value}
      </dd>
    </div>
  );
}