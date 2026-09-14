export const APPLICATION_STATUSES = [
  "Saved",
  "Applied",
  "Screening",
  "Assessment",
  "Interview",
  "Offer",
  "Rejected",
  "Withdrawn",
] as const;

export const WORK_MODES = [
  "On-site",
  "Hybrid",
  "Remote",
] as const;

export const EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Internship",
  "Contract",
  "Freelance",
  "Other",
] as const;

export const PLATFORMS = [
  "LinkedIn",
  "JobStreet",
  "Indeed",
  "Hiredly",
  "MyFutureJobs",
  "Company Website",
  "Referral",
  "Email",
  "Other",
] as const;

export interface Application {
  id: number;
  userId: number;

  companyName: string;
  position: string;

  location: string | null;
  workMode: string | null;
  employmentType: string | null;

  dateApplied: string;

  platform: string | null;

  applicationUrl: string | null;
  companyUrl: string | null;

  status: string;

  salary: string | null;

  jobDescription: string | null;
  requirements: string | null;
  responsibilities: string | null;
  skills: string | null;

  followUpDate: string | null;
  remarks: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface ApplicationFormData {
  companyName: string;
  position: string;

  location: string;
  workMode: string;
  employmentType: string;

  dateApplied: string;

  platform: string;

  applicationUrl: string;
  companyUrl: string;

  status: string;

  salary: string;

  jobDescription: string;
  requirements: string;
  responsibilities: string;
  skills: string;

  followUpDate: string;
  remarks: string;
}

export interface DashboardData {
  total: number;
  interviews: number;
  offers: number;
  rejected: number;

  recent: Application[];

  statusCounts: Record<string, number>;
}

export const EMPTY_APPLICATION_FORM: ApplicationFormData = {
  companyName: "",
  position: "",

  location: "",
  workMode: "",
  employmentType: "",

  dateApplied: new Date().toISOString().slice(0, 10),

  platform: "",

  applicationUrl: "",
  companyUrl: "",

  status: "Applied",

  salary: "",

  jobDescription: "",
  requirements: "",
  responsibilities: "",
  skills: "",

  followUpDate: "",
  remarks: "",
};