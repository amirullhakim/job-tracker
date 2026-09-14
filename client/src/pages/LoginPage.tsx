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

export default function LoginPage() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] = useState("");

  const [submitting, setSubmitting] =
    useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSubmitting(true);

    try {
      await login(email, password);

      navigate("/", {
        replace: true,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
            "Unable to log in."
        );
      } else {
        setError("Unable to log in.");
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
                <BriefcaseBusiness size={24} />
              </div>

              <h1 className="mt-8 max-w-sm text-4xl font-semibold leading-tight">
                Keep your job search clear and
                organised.
              </h1>

              <p className="mt-5 max-w-md leading-7 text-blue-100/80">
                Track applications, interviews,
                offers and follow-ups in one calm
                workspace.
              </p>
            </div>

            <p className="text-sm text-blue-100/60">
              Job Application Tracker
            </p>
          </div>

          <div className="px-7 py-10 sm:px-12 sm:py-14">
            <div className="lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#DDF7F8] text-[#172B4D]">
                <BriefcaseBusiness size={22} />
              </div>
            </div>

            <div className="mt-6 lg:mt-0">
              <p className="text-sm font-medium text-[#1B7A89]">
                Welcome back
              </p>

              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#172B4D]">
                Sign in to your account
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Continue managing your job
                applications.
              </p>
            </div>

            {error && (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >
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
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#47C6CE] focus:ring-4 focus:ring-[#DDF7F8]"
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
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(event) =>
                      setPassword(
                        event.target.value
                      )
                    }
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm text-gray-900 outline-none transition focus:border-[#47C6CE] focus:ring-4 focus:ring-[#DDF7F8]"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#172B4D] px-4 py-3 font-medium text-white transition hover:bg-[#213B66] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? "Signing in..."
                  : "Sign in"}

                {!submitting && (
                  <ArrowRight size={18} />
                )}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-[#1B7A89] hover:text-[#172B4D]"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}