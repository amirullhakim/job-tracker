import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { ProtectedRoute } from "./auth/ProtectedRoute";
import { PublicOnlyRoute } from "./auth/PublicOnlyRoute";

import AppLayout from "./components/AppLayout";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import DashboardPage from "./pages/DashboardPage";
import ApplicationsPage from "./pages/ApplicationsPage";
import ApplicationFormPage from "./pages/ApplicationFormPage";
import ApplicationDetailsPage from "./pages/ApplicationDetailsPage";

import SettingsPage from "./pages/SettingsPage";

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <RegisterPage />
          </PublicOnlyRoute>
        }
      />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={<DashboardPage />}
        />

        <Route
          path="applications"
          element={<ApplicationsPage />}
        />

        <Route
          path="applications/new"
          element={
            <ApplicationFormPage />
          }
        />

        <Route
          path="applications/:id"
          element={
            <ApplicationDetailsPage />
          }
        />

        <Route
          path="applications/:id/edit"
          element={
            <ApplicationFormPage />
          }
        />

        <Route
          path="settings"
          element={<SettingsPage />}
        />
      </Route>

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />
    </Routes>
  );
}

export default App;