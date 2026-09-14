import {
  useEffect,
  useState,
} from "react";

import type {
  FormEvent,
} from "react";

import axios from "axios";

import {
  CheckCircle2,
  Monitor,
  Moon,
  Palette,
  Save,
  Sun,
  UserRound,
} from "lucide-react";

import { useAuth } from "../auth/AuthContext";
import { useTheme } from "../theme/ThemeContext";

import type {
  ThemePreference,
} from "../theme/ThemeContext";

export default function SettingsPage() {
  const {
    user,
    updateProfile,
  } = useAuth();

  const {
    theme,
    setTheme,
  } = useTheme();

  const [name, setName] =
    useState(user?.name ?? "");

  const [email, setEmail] =
    useState(user?.email ?? "");

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  useEffect(() => {
    setName(user?.name ?? "");
    setEmail(user?.email ?? "");
  }, [user]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError(
        "Please enter your name."
      );

      return;
    }

    if (!email.trim()) {
      setError(
        "Please enter your email."
      );

      return;
    }

    setSaving(true);

    try {
      await updateProfile(
        name.trim(),
        email.trim()
      );

      setSuccess(
        "Profile updated successfully."
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
            "Could not update profile."
        );
      } else {
        setError(
          "Could not update profile."
        );
      }
    } finally {
      setSaving(false);
    }
  }

  const themeOptions: {
    value: ThemePreference;
    label: string;
    description: string;
    icon: typeof Sun;
  }[] = [
    {
      value: "light",
      label: "Light",
      description:
        "Always use the light appearance.",
      icon: Sun,
    },

    {
      value: "dark",
      label: "Dark",
      description:
        "Always use the dark appearance.",
      icon: Moon,
    },

    {
      value: "system",
      label: "System",
      description:
        "Follow your device appearance.",
      icon: Monitor,
    },
  ];

  return (
    <div className="pb-24 lg:pb-0">
      <div>
        <p className="text-sm font-medium text-[#1B7A89] dark:text-[#47C6CE]">
          Settings
        </p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#172B4D] dark:text-slate-100 sm:text-3xl">
          Account Settings
        </h1>

        <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
          Manage your profile and application
          appearance.
        </p>
      </div>

      <div className="mt-8 max-w-4xl space-y-6">
        {/* PROFILE */}

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-start gap-4 border-b border-slate-100 px-6 py-5 dark:border-slate-800">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#DDF7F8] text-[#1B7A89] dark:bg-slate-800 dark:text-[#47C6CE]">
              <UserRound size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-[#172B4D] dark:text-slate-100">
                Profile
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                Update your personal account
                information.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-6"
          >
            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300">
                <CheckCircle2
                  size={17}
                />

                {success}
              </div>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="settingsName"
                  className="mb-2 block text-sm font-medium text-[#172B4D] dark:text-slate-200"
                >
                  Name
                </label>

                <input
                  id="settingsName"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(
                      event.target.value
                    )
                  }
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#47C6CE] focus:ring-4 focus:ring-[#DDF7F8] dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-cyan-950"
                />
              </div>

              <div>
                <label
                  htmlFor="settingsEmail"
                  className="mb-2 block text-sm font-medium text-[#172B4D] dark:text-slate-200"
                >
                  Email
                </label>

                <input
                  id="settingsEmail"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#47C6CE] focus:ring-4 focus:ring-[#DDF7F8] dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-cyan-950"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={saving}
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
                  {saving
                    ? "Saving..."
                    : "Save changes"}
                </span>
              </button>
            </div>
          </form>
        </section>

        {/* APPEARANCE */}

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-start gap-4 border-b border-slate-100 px-6 py-5 dark:border-slate-800">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#DDF7F8] text-[#1B7A89] dark:bg-slate-800 dark:text-[#47C6CE]">
              <Palette size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-[#172B4D] dark:text-slate-100">
                Appearance
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                Choose how Job Tracker looks
                on your device.
              </p>
            </div>
          </div>

          <div className="grid gap-4 p-6 md:grid-cols-3">
            {themeOptions.map(
              (option) => {
                const Icon =
                  option.icon;

                const selected =
                  theme === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setTheme(
                        option.value
                      )
                    }
                    className={[
                      "relative rounded-2xl border p-5 text-left transition",
                      selected
                        ? "border-[#47C6CE] bg-[#F3FCFC] ring-2 ring-[#DDF7F8] dark:border-[#47C6CE] dark:bg-cyan-950/20 dark:ring-cyan-950"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600 dark:hover:bg-slate-800",
                    ].join(" ")}
                  >
                    <div
                      className={[
                        "flex h-10 w-10 items-center justify-center rounded-xl",
                        selected
                          ? "bg-[#DDF7F8] text-[#1B7A89] dark:bg-cyan-950 dark:text-[#47C6CE]"
                          : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300",
                      ].join(" ")}
                    >
                      <Icon size={20} />
                    </div>

                    <p className="mt-4 font-medium text-[#172B4D] dark:text-slate-100">
                      {option.label}
                    </p>

                    <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-slate-400">
                      {
                        option.description
                      }
                    </p>

                    {selected && (
                      <CheckCircle2
                        size={18}
                        className="absolute right-4 top-4 text-[#1B7A89] dark:text-[#47C6CE]"
                      />
                    )}
                  </button>
                );
              }
            )}
          </div>
        </section>
      </div>
    </div>
  );
}