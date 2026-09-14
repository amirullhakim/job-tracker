import { useState } from "react";

import type { FormEvent } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  ArrowRight,
  BriefcaseBusiness,
  Eye,
  EyeOff,
} from "lucide-react";

import axios from "axios";

import { useAuth } from "../auth/AuthContext";

export default function RegisterPage() {
  const navigate =
    useNavigate();

  const { register } =
    useAuth();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    const cleanName =
      name.trim();

    const cleanEmail =
      email
        .trim()
        .toLowerCase();

    if (!cleanName) {
      setError(
        "Please enter your name."
      );

      return;
    }

    if (!cleanEmail) {
      setError(
        "Please enter your email address."
      );

      return;
    }

    if (
      password.length < 6
    ) {
      setError(
        "Password must be at least 6 characters."
      );

      return;
    }

    if (
      password !==
      confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );

      return;
    }

    setSubmitting(true);

    try {
      await register(
        cleanName,
        cleanEmail,
        password
      );

      navigate("/", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Registration failed:",
        error
      );

      if (
        axios.isAxiosError(
          error
        )
      ) {
        if (
          error.code ===
          "ECONNABORTED"
        ) {
          setError(
            "The server took too long to respond. Please try again."
          );
        } else if (
          !error.response
        ) {
          setError(
            "Unable to connect to the server. Please try again."
          );
        } else {
          setError(
            error.response.data
              ?.message ||
              "Unable to create account."
          );
        }
      } else if (
        error instanceof Error
      ) {
        setError(
          error.message ||
            "Unable to create account."
        );
      } else {
        setError(
          "Unable to create account."
        );
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F7FAFC]">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6 py-12 lg:px-8">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_70px_rgba(23,43,77,0.08)] lg:grid-cols-2">
          <div className="hidden bg-[#172B4D] p-12 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#A8D8F0] text-[#172B4D]">
                <BriefcaseBusiness
                  size={24}
                />
              </div>

              <h1 className="mt-8 max-w-sm text-4xl font-semibold leading-tight">
                One place for every
                job opportunity.
              </h1>

              <p className="mt-5 max-w-md leading-7 text-blue-100/80">
                Stay organised from
                your first application
                until your final offer.
              </p>
            </div>

            <p className="text-sm text-blue-100/60">
              Job Application Tracker
            </p>
          </div>

          <div className="px-7 py-10 sm:px-12 sm:py-14">
            <div className="lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#DDF7F8] text-[#172B4D]">
                <BriefcaseBusiness
                  size={22}
                />
              </div>
            </div>

            <div className="mt-6 lg:mt-0">
              <p className="text-sm font-medium text-[#1B7A89]">
                Get started
              </p>

              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#172B4D]">
                Create your account
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Start tracking your
                job search in one
                organised workspace.
              </p>
            </div>

            {error && (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form
              onSubmit={
                handleSubmit
              }
              className="mt-8 space-y-5"
            >
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-[#172B4D]"
                >
                  Name
                </label>

                <input
                  id="name"
                  type="text"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(
                    event
                  ) =>
                    setName(
                      event.target
                        .value
                    )
                  }
                  placeholder="Your name"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#47C6CE] focus:ring-4 focus:ring-[#DDF7F8]"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-[#172B4D]"
                >
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(
                    event
                  ) =>
                    setEmail(
                      event.target
                        .value
                    )
                  }
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#47C6CE] focus:ring-4 focus:ring-[#DDF7F8]"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-[#172B4D]"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    required
                    minLength={6}
                    autoComplete="new-password"
                    value={password}
                    onChange={(
                      event
                    ) =>
                      setPassword(
                        event.target
                          .value
                      )
                    }
                    placeholder="Minimum 6 characters"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-12 text-sm outline-none transition focus:border-[#47C6CE] focus:ring-4 focus:ring-[#DDF7F8]"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (current) =>
                          !current
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-gray-400 hover:bg-gray-50"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff
                        size={18}
                      />
                    ) : (
                      <Eye
                        size={18}
                      />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-[#172B4D]"
                >
                  Confirm password
                </label>

                <input
                  id="confirmPassword"
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={
                    confirmPassword
                  }
                  onChange={(
                    event
                  ) =>
                    setConfirmPassword(
                      event.target
                        .value
                    )
                  }
                  placeholder="Enter password again"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#47C6CE] focus:ring-4 focus:ring-[#DDF7F8]"
                />
              </div>

              <button
                type="submit"
                disabled={
                  submitting
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#172B4D] px-4 py-3 font-medium text-white transition hover:bg-[#213B66] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? "Creating account..."
                  : "Create account"}

                {!submitting && (
                  <ArrowRight
                    size={18}
                  />
                )}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-gray-500">
              Already have an
              account?{" "}

              <Link
                to="/login"
                className="font-semibold text-[#1B7A89] hover:text-[#172B4D]"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}