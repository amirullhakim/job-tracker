import {
  useEffect,
  useState,
} from "react";

import type {
  ChangeEvent,
  FormEvent,
} from "react";

import {
  ArrowLeft,
  Save,
} from "lucide-react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import axios from "axios";

import {
  createApplication,
  getApplication,
  updateApplication,
} from "../api/applications";

import { useToast } from "../components/ToastProvider";

import {
  APPLICATION_STATUSES,
  EMPLOYMENT_TYPES,
  EMPTY_APPLICATION_FORM,
  PLATFORMS,
  WORK_MODES,
} from "../types/application";

import type { ApplicationFormData } from "../types/application";

export default function ApplicationFormPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const { showToast } =
    useToast();

  const applicationId = id
    ? Number(id)
    : null;

  const isEditing =
    applicationId !== null;

  const [form, setForm] =
    useState<ApplicationFormData>({
      ...EMPTY_APPLICATION_FORM,
    });

  const [loading, setLoading] =
    useState(isEditing);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (!applicationId) {
      return;
    }

    async function loadApplication() {
      try {
        setLoading(true);

        const application =
          await getApplication(
            applicationId!
          );

        setForm({
          companyName:
            application.companyName,

          position:
            application.position,

          location:
            application.location ||
            "",

          workMode:
            application.workMode ||
            "",

          employmentType:
            application.employmentType ||
            "",

          dateApplied:
            application.dateApplied.slice(
              0,
              10
            ),

          platform:
            application.platform ||
            "",

          applicationUrl:
            application.applicationUrl ||
            "",

          companyUrl:
            application.companyUrl ||
            "",

          status:
            application.status,

          salary:
            application.salary ||
            "",

          jobDescription:
            application.jobDescription ||
            "",

          requirements:
            application.requirements ||
            "",

          responsibilities:
            application.responsibilities ||
            "",

          skills:
            application.skills ||
            "",

          followUpDate:
            application.followUpDate
              ? application.followUpDate.slice(
                  0,
                  10
                )
              : "",

          remarks:
            application.remarks ||
            "",
        });
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

  function handleChange(
    event: ChangeEvent<
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement
    >
  ) {
    const {
      name,
      value,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSubmitting(true);

    try {
      if (
        isEditing &&
        applicationId
      ) {
        await updateApplication(
          applicationId,
          form
        );

        showToast(
          "Application updated successfully.",
          "success"
        );

        navigate(
          `/applications/${applicationId}`
        );
      } else {
        const application =
          await createApplication(
            form
          );

        showToast(
          "Application added successfully.",
          "success"
        );

        navigate(
          `/applications/${application.id}`
        );
      }
    } catch (error) {
      if (
        axios.isAxiosError(
          error
        )
      ) {
        setError(
          error.response?.data
            ?.message ||
            "Could not save the application."
        );
      } else {
        setError(
          "Could not save the application."
        );
      }

      showToast(
        "Could not save the application.",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#47C6CE] focus:ring-4 focus:ring-[#DDF7F8]";

  const labelClass =
    "mb-2 block text-sm font-medium text-[#172B4D]";

  if (loading) {
    return (
      <div className="flex min-h-72 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-[#DDF7F8] border-t-[#172B4D]" />

          <p className="mt-4 text-sm text-gray-500">
            Loading application...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 lg:pb-0">
      <Link
        to={
          isEditing &&
          applicationId
            ? `/applications/${applicationId}`
            : "/applications"
        }
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-[#172B4D]"
      >
        <ArrowLeft size={17} />
        Back
      </Link>

      <div className="mt-5">
        <p className="text-sm font-medium text-[#1B7A89]">
          Applications
        </p>

        <h1 className="mt-1 text-2xl font-semibold text-[#172B4D] sm:text-3xl">
          {isEditing
            ? "Edit Application"
            : "Add Application"}
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          {isEditing
            ? "Update the details of this job opportunity."
            : "Save the important details of this job opportunity."}
        </p>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-7 space-y-6"
      >
        {/* JOB INFORMATION */}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="font-semibold text-[#172B4D]">
            Job information
          </h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="companyName"
                className={
                  labelClass
                }
              >
                Company name *
              </label>

              <input
                id="companyName"
                name="companyName"
                required
                value={
                  form.companyName
                }
                onChange={
                  handleChange
                }
                placeholder="e.g. CelcomDigi"
                className={
                  inputClass
                }
              />
            </div>

            <div>
              <label
                htmlFor="position"
                className={
                  labelClass
                }
              >
                Position *
              </label>

              <input
                id="position"
                name="position"
                required
                value={
                  form.position
                }
                onChange={
                  handleChange
                }
                placeholder="e.g. Data Analyst"
                className={
                  inputClass
                }
              />
            </div>

            <div>
              <label
                htmlFor="location"
                className={
                  labelClass
                }
              >
                Location
              </label>

              <input
                id="location"
                name="location"
                value={
                  form.location
                }
                onChange={
                  handleChange
                }
                placeholder="e.g. Petaling Jaya"
                className={
                  inputClass
                }
              />
            </div>

            <div>
              <label
                htmlFor="salary"
                className={
                  labelClass
                }
              >
                Salary
              </label>

              <input
                id="salary"
                name="salary"
                value={
                  form.salary
                }
                onChange={
                  handleChange
                }
                placeholder="e.g. RM 4,000 – RM 5,000"
                className={
                  inputClass
                }
              />
            </div>

            <div>
              <label
                htmlFor="workMode"
                className={
                  labelClass
                }
              >
                Work mode
              </label>

              <select
                id="workMode"
                name="workMode"
                value={
                  form.workMode
                }
                onChange={
                  handleChange
                }
                className={
                  inputClass
                }
              >
                <option value="">
                  Select work mode
                </option>

                {WORK_MODES.map(
                  (item) => (
                    <option
                      key={item}
                      value={
                        item
                      }
                    >
                      {item}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label
                htmlFor="employmentType"
                className={
                  labelClass
                }
              >
                Employment type
              </label>

              <select
                id="employmentType"
                name="employmentType"
                value={
                  form.employmentType
                }
                onChange={
                  handleChange
                }
                className={
                  inputClass
                }
              >
                <option value="">
                  Select employment type
                </option>

                {EMPLOYMENT_TYPES.map(
                  (item) => (
                    <option
                      key={item}
                      value={
                        item
                      }
                    >
                      {item}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>
        </section>

        {/* APPLICATION DETAILS */}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="font-semibold text-[#172B4D]">
            Application details
          </h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="dateApplied"
                className={
                  labelClass
                }
              >
                Date applied *
              </label>

              <input
                id="dateApplied"
                name="dateApplied"
                type="date"
                required
                value={
                  form.dateApplied
                }
                onChange={
                  handleChange
                }
                className={
                  inputClass
                }
              />
            </div>

            <div>
              <label
                htmlFor="status"
                className={
                  labelClass
                }
              >
                Status
              </label>

              <select
                id="status"
                name="status"
                value={
                  form.status
                }
                onChange={
                  handleChange
                }
                className={
                  inputClass
                }
              >
                {APPLICATION_STATUSES.map(
                  (item) => (
                    <option
                      key={item}
                      value={
                        item
                      }
                    >
                      {item}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label
                htmlFor="platform"
                className={
                  labelClass
                }
              >
                Platform
              </label>

              <select
                id="platform"
                name="platform"
                value={
                  form.platform
                }
                onChange={
                  handleChange
                }
                className={
                  inputClass
                }
              >
                <option value="">
                  Select platform
                </option>

                {PLATFORMS.map(
                  (item) => (
                    <option
                      key={item}
                      value={
                        item
                      }
                    >
                      {item}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label
                htmlFor="followUpDate"
                className={
                  labelClass
                }
              >
                Follow-up date
              </label>

              <input
                id="followUpDate"
                name="followUpDate"
                type="date"
                value={
                  form.followUpDate
                }
                onChange={
                  handleChange
                }
                className={
                  inputClass
                }
              />
            </div>

            <div>
              <label
                htmlFor="applicationUrl"
                className={
                  labelClass
                }
              >
                Application URL
              </label>

              <input
                id="applicationUrl"
                name="applicationUrl"
                type="url"
                value={
                  form.applicationUrl
                }
                onChange={
                  handleChange
                }
                placeholder="https://..."
                className={
                  inputClass
                }
              />
            </div>

            <div>
              <label
                htmlFor="companyUrl"
                className={
                  labelClass
                }
              >
                Company URL
              </label>

              <input
                id="companyUrl"
                name="companyUrl"
                type="url"
                value={
                  form.companyUrl
                }
                onChange={
                  handleChange
                }
                placeholder="https://..."
                className={
                  inputClass
                }
              />
            </div>
          </div>
        </section>

        {/* JOB DETAILS */}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="font-semibold text-[#172B4D]">
            Job details
          </h2>

          <div className="mt-5 space-y-5">
            <div>
              <label
                htmlFor="jobDescription"
                className={
                  labelClass
                }
              >
                Job description
              </label>

              <textarea
                id="jobDescription"
                name="jobDescription"
                rows={5}
                value={
                  form.jobDescription
                }
                onChange={
                  handleChange
                }
                placeholder="Paste or summarise the job description..."
                className={
                  inputClass
                }
              />
            </div>

            <div>
              <label
                htmlFor="requirements"
                className={
                  labelClass
                }
              >
                Requirements
              </label>

              <textarea
                id="requirements"
                name="requirements"
                rows={4}
                value={
                  form.requirements
                }
                onChange={
                  handleChange
                }
                placeholder="Key requirements..."
                className={
                  inputClass
                }
              />
            </div>

            <div>
              <label
                htmlFor="responsibilities"
                className={
                  labelClass
                }
              >
                Responsibilities
              </label>

              <textarea
                id="responsibilities"
                name="responsibilities"
                rows={4}
                value={
                  form.responsibilities
                }
                onChange={
                  handleChange
                }
                placeholder="Main responsibilities..."
                className={
                  inputClass
                }
              />
            </div>

            <div>
              <label
                htmlFor="skills"
                className={
                  labelClass
                }
              >
                Skills
              </label>

              <textarea
                id="skills"
                name="skills"
                rows={3}
                value={
                  form.skills
                }
                onChange={
                  handleChange
                }
                placeholder="e.g. Python, SQL, Power BI..."
                className={
                  inputClass
                }
              />
            </div>

            <div>
              <label
                htmlFor="remarks"
                className={
                  labelClass
                }
              >
                Remarks
              </label>

              <textarea
                id="remarks"
                name="remarks"
                rows={4}
                value={
                  form.remarks
                }
                onChange={
                  handleChange
                }
                placeholder="Interview notes, recruiter details, follow-up notes..."
                className={
                  inputClass
                }
              />
            </div>
          </div>
        </section>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            to={
              isEditing &&
              applicationId
                ? `/applications/${applicationId}`
                : "/applications"
            }
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-center text-sm font-medium text-gray-600 transition hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={
              submitting
            }
            style={{
              color: "#FFFFFF",
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#172B4D] px-5 py-3 text-sm font-semibold shadow-sm transition hover:bg-[#213B66] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save
              size={17}
              color="#FFFFFF"
            />

            <span className="text-white">
              {submitting
                ? "Saving..."
                : isEditing
                  ? "Save changes"
                  : "Add application"}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}