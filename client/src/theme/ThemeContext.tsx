import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type { ReactNode } from "react";

export type ThemePreference =
  | "light"
  | "dark"
  | "system";

interface ThemeContextValue {
  theme: ThemePreference;

  setTheme: (
    theme: ThemePreference
  ) => void;
}

const ThemeContext = createContext<
  ThemeContextValue | undefined
>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

const STORAGE_KEY =
  "jobTrackerTheme";

function getSavedTheme(): ThemePreference {
  const saved =
    localStorage.getItem(STORAGE_KEY);

  if (
    saved === "light" ||
    saved === "dark" ||
    saved === "system"
  ) {
    return saved;
  }

  return "system";
}

function shouldUseDark(
  theme: ThemePreference
) {
  if (theme === "dark") {
    return true;
  }

  if (theme === "light") {
    return false;
  }

  return window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
}

export function ThemeProvider({
  children,
}: ThemeProviderProps) {
  const [theme, setThemeState] =
    useState<ThemePreference>(
      getSavedTheme
    );

  useEffect(() => {
    const mediaQuery =
      window.matchMedia(
        "(prefers-color-scheme: dark)"
      );

    function applyTheme() {
      const useDark =
        shouldUseDark(theme);

      document.documentElement.classList.toggle(
        "dark",
        useDark
      );

      document.documentElement.style.colorScheme =
        useDark ? "dark" : "light";
    }

    applyTheme();

    if (theme === "system") {
      mediaQuery.addEventListener(
        "change",
        applyTheme
      );
    }

    return () => {
      mediaQuery.removeEventListener(
        "change",
        applyTheme
      );
    };
  }, [theme]);

  function setTheme(
    newTheme: ThemePreference
  ) {
    localStorage.setItem(
      STORAGE_KEY,
      newTheme
    );

    setThemeState(newTheme);
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context =
    useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider."
    );
  }

  return context;
}