import { api } from "../../shared/api/client.js";

export async function submitSalonRegistration({
  name,
  address,
  city,
  state,
  zip_code,
  phone,
  email,
  description,
  timezone,
  logoFile,
  licenseFile,
}) {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("address", address);
  if (city) formData.append("city", city);
  if (state) formData.append("state", state);
  if (zip_code) formData.append("zip_code", zip_code);
  if (phone) formData.append("phone", phone);
  if (email) formData.append("email", email);
  if (description) formData.append("description", description);
  if (timezone) formData.append("timezone", timezone);
  if (logoFile) formData.append("logo", logoFile);
  if (licenseFile) formData.append("license", licenseFile);

  return api("/salons/apply", {
    method: "POST",
    body: formData,
  });
}

export async function getOwnedSalon() {
  return api("/salons/mine");
}

export async function getSalonDetail(salonId) {
  return api(`/salons/${salonId}`);
}

export async function updatePendingApplication(salonId, {
  name,
  address,
  city,
  state,
  zip_code,
  phone,
  email,
  description,
  timezone,
  logoFile,
  licenseFile,
}) {
  const formData = new FormData();
  if (name) formData.append("name", name);
  if (address) formData.append("address", address);
  if (city) formData.append("city", city);
  if (state) formData.append("state", state);
  if (zip_code) formData.append("zip_code", zip_code);
  if (phone) formData.append("phone", phone);
  if (email) formData.append("email", email);
  if (description) formData.append("description", description);
  if (timezone) formData.append("timezone", timezone);
  if (logoFile) formData.append("logo", logoFile);
  if (licenseFile) formData.append("license", licenseFile);

  return api(`/salons/${salonId}/application`, {
    method: "PATCH",
    body: formData,
  });
}
