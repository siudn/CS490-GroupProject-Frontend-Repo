import { api } from "../../shared/api/client.js";

const AVAILABILITY_BASE = "/schedule/availability";
const APPOINTMENTS_BASE = "/appointments/";

export async function fetchAvailability() {
  return api(AVAILABILITY_BASE);
}

export async function createAvailability(availability) {
  if (!Array.isArray(availability)) {
    throw new Error("Availability payload must be an array.");
  }

  return api(AVAILABILITY_BASE, {
    method: "POST",
    body: JSON.stringify({ availability }),
  });
}

export async function updateAvailability(updates) {
  if (!Array.isArray(updates) || updates.length === 0) {
    throw new Error("No availability updates provided.");
  }

  return api(AVAILABILITY_BASE, {
    method: "PATCH",
    body: JSON.stringify({ availability: updates }),
  });
}

export async function fetchAppointments() {
  return api(APPOINTMENTS_BASE);
}

export async function patchAppointment(payload) {
  if (!payload?.id) {
    throw new Error("Appointment update payload must include an id.");
  }

  return api(APPOINTMENTS_BASE, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

