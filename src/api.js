// Single place that talks to the backend. Adds the saved JWT to every request.
const BASE = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export const getToken = () => {
  try { return localStorage.getItem("token"); } catch { return null; }
};
export const setToken = (t) => {
  try { t ? localStorage.setItem("token", t) : localStorage.removeItem("token"); } catch { /* storage blocked */ }
};

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export async function api(path, { method = "GET", body } = {}) {
  const headers = {};
  if (body) headers["Content-Type"] = "application/json";
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });
  } catch {
    throw new ApiError("Cannot reach the server. Is the backend running?", 0);
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(data.message || `Request failed (${res.status})`, res.status);
  return data;
}

export const formatAED = (n) => `AED ${Number(n).toLocaleString("en-US")}`;
