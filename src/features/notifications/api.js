import { api } from "../../shared/api/client.js";

/**
 * Get all notifications for the current user
 * @returns {Promise<Array>} Array of notification objects
 */
export async function getNotifications() {
  try {
    const res = await api("/notifications/");
    console.log("getNotifications API response:", res);
    return Array.isArray(res) ? res : res.notifications || [];
  } catch (error) {
    // If CORS error, try without trailing slash
    if (error.message?.includes("CORS") || error.message?.includes("Failed to fetch")) {
      try {
        const res = await api("/notifications");
        console.log("getNotifications API response (retry):", res);
        return Array.isArray(res) ? res : res.notifications || [];
      } catch (retryError) {
        console.error("Failed to fetch notifications after retry:", retryError);
        return [];
      }
    }
    throw error;
  }
}

/**
 * Get unread notification count
 * @returns {Promise<number>} Number of unread notifications
 */
export async function getUnreadCount() {
  const res = await api("/notifications/unread-count");
  console.log("getUnreadCount API response:", res);
  return res.unread || 0;
}

/**
 * Mark a single notification as read
 * @param {string} notificationId - The notification ID
 * @returns {Promise<Object>} Updated notification object
 */
export async function markAsRead(notificationId) {
  return api(`/notifications/${notificationId}/mark-read`, {
    method: "PATCH",
  });
}

/**
 * Mark all notifications as read for the current user
 * @returns {Promise<Object>} Object with updated count
 */
export async function markAllAsRead() {
  return api("/notifications/mark-all-read", {
    method: "PATCH",
  });
}

