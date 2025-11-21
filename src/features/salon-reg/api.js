import { api } from "../../shared/api/client.js";

export async function submitSalonRegistration(formData) {
  if (import.meta.env.VITE_MOCK === "1") {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      success: true,
      applicationId: `APP-${Date.now()}`,
      status: "pending",
      message: "Application submitted successfully",
    };
  }

  return api("/salon/register", {
    method: "POST",
    body: JSON.stringify(formData),
  });
}

export async function getSalonRegistrationStatus(ownerId) {
  if (import.meta.env.VITE_MOCK === "1") {
    return (
      MOCK_SALON_REGISTRATIONS[ownerId] || {
        status: "not_submitted",
        applicationId: null,
        submittedAt: null,
        reviewedAt: null,
        rejectionReason: null,
      }
    );
  }

  return api(`/salon/registration/status/${ownerId}`);
}

export async function updateSalonRegistration(applicationId, formData) {
  if (import.meta.env.VITE_MOCK === "1") {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      success: true,
      status: "pending",
      message: "Application updated successfully",
    };
  }

  return api(`/salon/registration/${applicationId}`, {
    method: "PUT",
    body: JSON.stringify(formData),
  });
}

const MOCK_SALON_REGISTRATIONS = {
  "owner-1": {
    status: "approved",
    applicationId: "APP-001",
    submittedAt: "2025-10-01T10:00:00Z",
    reviewedAt: "2025-10-02T14:30:00Z",
    rejectionReason: null,
  },
  "owner-2": {
    status: "pending",
    applicationId: "APP-002",
    submittedAt: "2025-10-10T09:15:00Z",
    reviewedAt: null,
    rejectionReason: null,
  },
  "owner-3": {
    status: "rejected",
    applicationId: "APP-003",
    submittedAt: "2025-10-05T16:20:00Z",
    reviewedAt: "2025-10-06T11:45:00Z",
    rejectionReason: "Invalid business license. Please upload a valid license document.",
  },
};
