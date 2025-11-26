// Token storage utilities
const TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAccessToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setRefreshToken(token) {
  if (token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}

export function clearTokens() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export async function api(path, opts = {}) {
  const token = getAccessToken();
  const isFormData = typeof FormData !== "undefined" && opts.body instanceof FormData;
  const headers = isFormData ? { ...(opts.headers || {}) } : { "Content-Type": "application/json", ...(opts.headers || {}) };
  
  // Add Bearer token if available
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Prepare body - stringify JSON, leave FormData as-is
  let body = opts.body;
  if (!isFormData && body && typeof body === "object") {
    body = JSON.stringify(body);
  }
  
  const res = await fetch(import.meta.env.VITE_API + path, {
    ...opts,
    headers,
    body,
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    let errorMessage = errorText;
    try {
      const errorJson = JSON.parse(errorText);
      if (errorJson.message) {
        errorMessage = errorJson.message;
      } else if (errorJson.error) {
        errorMessage = errorJson.error;
      }
    } catch {
      // If not JSON, use the text as-is
    }
    throw new Error(errorMessage);
  }
  
  return res.json();
}
