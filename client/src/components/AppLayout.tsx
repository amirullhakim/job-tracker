import {
  BriefcaseBusiness,
  LayoutDashboard,
  LogOut,
  Settings,
} from "lucide-react";

import {
  NavLink,
  Outlet,
} from "react-router-dom";

import { useAuth } from "../auth/AuthContext";

export default function AppLayout() {
  const { user, logout } = useAuth();

  const initial =
    user?.name?.charAt(0).toUpperCase() || "U";

  const navClass = ({
    isActive,
  }: {
    isActive: boolean;
  }) =>
    [
      "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition",
      isActive
        ? "bg-[#DDF7F8] text-[#172B4D]"
        : "text-slate-500 hover:bg-slate-50 hover:text-[#172B4D]",
    ].join(" ");

  async function handleLogout() {
    await logout();
  }

  return (
    <div className="min-h-screen bg-[#F7FAFC] text-slate-900 transition-colors dark:bg-[#0B1120] dark:text-slate-100">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white transition-colors dark:border-slate-800 dark:bg-slate-900 lg:flex lg:flex-col">
        <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#DDF7F8] text-[#172B4D]">
            <BriefcaseBusiness size={21} />
          </div>

          <div>
            <p className="font-semibold text-[#172B4D]">
              Job Tracker
            </p>

            <p className="text-xs text-gray-400">
              Application workspace
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-2 px-4 py-6">
          <NavLink
            to="/"
            end
            className={navClass}
          >
            <LayoutDashboard size={19} />
            Dashboard
          </NavLink>

          <NavLink
            to="/applications"
            className={navClass}
          >
            <BriefcaseBusiness size={19} />
            Applications
          </NavLink>

          <NavLink
            to="/settings"
            className={navClass}
          >
            <Settings size={19} />
            Settings
          </NavLink>
        </nav>

        <div className="border-t border-slate-100 p-4">
          <div className="mb-3 flex items-center gap-3 rounded-xl px-3 py-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#A8D8F0] text-sm font-semibold text-[#172B4D]">
              {initial}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-[#172B4D]">
                {user?.name}
              </p>

              <p className="truncate text-xs text-gray-400">
                {user?.email}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-500 transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-5 backdrop-blur transition-colors dark:border-slate-800 dark:bg-slate-900/95 lg:px-8">
          <div>
            <p className="text-sm font-medium text-[#172B4D] lg:hidden">
              Job Tracker
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-[#172B4D]">
                {user?.name}
              </p>

              <p className="text-xs text-gray-400">
                {user?.email}
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#DDF7F8] text-sm font-semibold text-[#172B4D]">
              {initial}
            </div>

            <button
              onClick={handleLogout}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-red-500 lg:hidden"
              aria-label="Sign out"
            >
              <LogOut size={19} />
            </button>
          </div>
        </header>

        <main className="px-5 py-7 lg:px-8 lg:py-8">
          <Outlet />
        </main>

        <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-slate-200 bg-white transition-colors dark:border-slate-800 dark:bg-slate-900 lg:hidden">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-1 py-3 text-xs ${
                isActive
                  ? "text-[#172B4D]"
                  : "text-gray-400"
              }`
            }
          >
            <LayoutDashboard size={19} />
            Dashboard
          </NavLink>

          <NavLink
            to="/applications"
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-1 py-3 text-xs ${
                isActive
                  ? "text-[#172B4D]"
                  : "text-gray-400"
              }`
            }
          >
            <BriefcaseBusiness size={19} />
            Applications
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-1 py-3 text-xs ${
                isActive
                  ? "text-[#172B4D]"
                  : "text-gray-400"
              }`
            }
          >
            <Settings size={19} />
            Settings
          </NavLink>
        </nav>
      </div>
    </div>
  );
}