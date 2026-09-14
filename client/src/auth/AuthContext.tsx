import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type { ReactNode } from "react";

import { api } from "../api/api";

export interface User {
  id: number;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;

  login: (
    email: string,
    password: string
  ) => Promise<void>;

  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<void>;

  updateProfile: (
    name: string,
    email: string
  ) => Promise<User>;

  refreshUser: () => Promise<void>;

  logout: () => Promise<void>;
}

const AuthContext = createContext<
  AuthContextValue | undefined
>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  async function refreshUser() {
    const token =
      localStorage.getItem(
        "jobTrackerToken"
      );

    if (!token) {
      setUser(null);
      return;
    }

    try {
      const response =
        await api.get("/auth/me");

      setUser(response.data.user);
    } catch {
      localStorage.removeItem(
        "jobTrackerToken"
      );

      setUser(null);
    }
  }

  useEffect(() => {
    async function initialiseAuth() {
      try {
        await refreshUser();
      } finally {
        setLoading(false);
      }
    }

    initialiseAuth();
  }, []);

  async function login(
    email: string,
    password: string
  ) {
    const response =
      await api.post(
        "/auth/login",
        {
          email: email
            .trim()
            .toLowerCase(),
          password,
        }
      );

    const token =
      response.data.token;

    const loggedInUser =
      response.data.user;

    if (
      !token ||
      !loggedInUser
    ) {
      throw new Error(
        "Invalid login response from server."
      );
    }

    localStorage.setItem(
      "jobTrackerToken",
      token
    );

    setUser(loggedInUser);
  }

  async function register(
    name: string,
    email: string,
    password: string
  ) {
    const response =
      await api.post(
        "/auth/register",
        {
          name: name.trim(),
          email: email
            .trim()
            .toLowerCase(),
          password,
        }
      );

    const token =
      response.data.token;

    const registeredUser =
      response.data.user;

    if (
      !token ||
      !registeredUser
    ) {
      throw new Error(
        "Invalid registration response from server."
      );
    }

    localStorage.setItem(
      "jobTrackerToken",
      token
    );

    setUser(registeredUser);
  }

  async function updateProfile(
    name: string,
    email: string
  ) {
    const response =
      await api.put(
        "/auth/profile",
        {
          name: name.trim(),
          email: email
            .trim()
            .toLowerCase(),
        }
      );

    const updatedUser: User =
      response.data.user;

    setUser(updatedUser);

    return updatedUser;
  }

  async function logout() {
    try {
      await api.post(
        "/auth/logout"
      );
    } catch {
      // Local logout should still work
      // if the API request fails.
    } finally {
      localStorage.removeItem(
        "jobTrackerToken"
      );

      setUser(null);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        updateProfile,
        refreshUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider."
    );
  }

  return context;
}