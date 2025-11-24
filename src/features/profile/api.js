import { api } from "../../shared/api/client.js";

/**
 * Get the current authenticated user's profile
 * @returns {Promise<Object>} User profile object
 */
export async function getCurrentUserProfile() {
  const res = await api("/auth/me");
  return res.user ?? null;
}

/**
 * Update the current user's profile
 * @param {Object} profileData - Profile data to update (all fields optional)
 * @returns {Promise<Object>} Updated profile object
 */
export async function updateUserProfile(profileData) {
  const res = await api("/auth/profile", {
    method: "PUT",
    body: JSON.stringify(profileData),
  });
  return res.profile ?? profileData;
}

/**
 * Upload a profile image file
 * @param {File} file - Image file to upload
 * @returns {Promise<string>} Signed URL to use as profile_image_url
 */
export async function uploadProfileImage(file) {
  const formData = new FormData();
  formData.append("file", file);
  
  const res = await api("/users/me/images", {
    method: "POST",
    body: formData,
  });
  
  // Handle different possible response structures
  // Backend may return { signed_url: "..." } or { url: "..." } or just the URL string
  return res.signed_url || res.url || res;
}

/**
 * Get available services for preferred_services selection
 * @returns {Promise<Array<string>>} Array of service names
 */
export async function getAvailableServices() {
  const res = await api("/services?unique=name");
  return res.services ?? [];
}
