import { api } from "../../shared/api/client.js";

function buildSearch(params = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    if (Array.isArray(value) && value.length === 0) return;
    search.set(key, Array.isArray(value) ? value.join(",") : value);
  });
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

async function fetchAppointments(params = {}) {
  const res = await api(`/appointments${buildSearch(params)}`);
  return res.appointments ?? [];
}

export async function listServices() {
  const res = await api("/services?unique=name");
  return res.services ?? [];
}

export async function listSalons({ q = "", location = "", services = [], sort = "top" } = {}) {
  const search = buildSearch({
    q,
    location,
    services,
    sort,
  });
  const res = await api(`/salons${search}`);
  return res.salons ?? [];
}

export async function getSalon(id) {
  return api(`/salons/${id}`);
}

export async function getSalonReviews(id) {
  const res = await api(`/salons/${id}/reviews?limit=6`);
  return res.reviews ?? [];
}

export async function listEmployees(salonId) {
  const res = await api(`/salons/${salonId}/employees`);
  return res.employees ?? [];
}

export async function listAvailability({ salonId, employeeId, serviceId, dateISO }) {
  const params = buildSearch({
    salon_id: salonId,
    barber_id: employeeId,
    service_id: serviceId,
    date: dateISO,
  });
  const res = await api(`/appointments/availability${params}`);
  return res.slots ?? [];
}

export async function listUserAppointments() {
  const upcoming = await fetchAppointments({ when: "upcoming" });
  const past = await fetchAppointments({ when: "past" });
  return { upcoming, past };
}

export async function createAppointment(payload) {
  return api("/appointments/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateAppointment(payload) {
  if (!payload?.id) throw new Error("Appointment update requires an id.");
  return api("/appointments", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function rescheduleAppointment(id, update) {
  return api(`/appointments/${id}/reschedule`, {
    method: "PATCH",
    body: JSON.stringify(update),
  });
}

export async function cancelAppointment(id, reason) {
  return api(`/appointments/${id}/cancel`, {
    method: "PATCH",
    body: JSON.stringify({ reason }),
  });
}

export async function submitReview(id, { stars, comment }) {
  return api(`/appointments/${id}/review`, {
    method: "POST",
    body: JSON.stringify({ stars, comment }),
  });
}

export async function listVendorRequests() {
  const pending = await fetchAppointments({ when: "upcoming", status: "pending" });
  const upcoming = await fetchAppointments({ when: "upcoming", status: "scheduled" });
  const denied = await fetchAppointments({ when: "past", status: "denied" });
  return { pending, upcoming, denied };
}

export async function vendorConfirm(id, message) {
  return api(`/appointments/${id}/action`, {
    method: "PATCH",
    body: JSON.stringify({ action: "confirm", message }),
  });
}

export async function vendorDeny(id, reason) {
  return api(`/appointments/${id}/action`, {
    method: "PATCH",
    body: JSON.stringify({ action: "deny", reason }),
  });
}
