import { api } from "./api";

import type {
  Application,
  ApplicationFormData,
  DashboardData,
} from "../types/application";

export async function getApplications() {
  const response = await api.get<{
    applications: Application[];
  }>("/applications");

  return response.data.applications;
}

export async function getApplication(id: number) {
  const response = await api.get<{
    application: Application;
  }>(`/applications/${id}`);

  return response.data.application;
}

export async function createApplication(
  data: ApplicationFormData
) {
  const response = await api.post<{
    application: Application;
  }>("/applications", data);

  return response.data.application;
}

export async function updateApplication(
  id: number,
  data: ApplicationFormData
) {
  const response = await api.put<{
    application: Application;
  }>(`/applications/${id}`, data);

  return response.data.application;
}

export async function deleteApplication(id: number) {
  await api.delete(`/applications/${id}`);
}

export async function getDashboard() {
  const response =
    await api.get<DashboardData>("/dashboard");

  return response.data;
}