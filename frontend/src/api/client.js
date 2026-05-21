const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export function getToken() {
  return localStorage.getItem("burnout_token");
}

export function setSession(session) {
  localStorage.setItem("burnout_token", session.token);
  localStorage.setItem("burnout_user", JSON.stringify(session.user));
}

export function clearSession() {
  localStorage.removeItem("burnout_token");
  localStorage.removeItem("burnout_user");
}

export function getUser() {
  const raw = localStorage.getItem("burnout_user");
  return raw ? JSON.parse(raw) : null;
}

export async function api(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `Request failed with ${response.status}`);
  }
  return data;
}
