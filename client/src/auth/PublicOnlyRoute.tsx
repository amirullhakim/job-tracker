import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

import { useAuth } from "./AuthContext";

interface PublicOnlyRouteProps {
  children: ReactNode;
}

export function PublicOnlyRoute({
  children,
}: PublicOnlyRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7FAFC]">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#D7EEF8] border-t-[#172B4D]" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
}