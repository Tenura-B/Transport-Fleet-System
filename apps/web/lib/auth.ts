export type AuthUser = {
  id: string;
  email: string;
  role: "ADMIN" | "MANAGER" | "DRIVER";
  createdAt: string;
  company: {
    id: string;
    name: string;
    logoUrl: string | null;
  };
};

type AuthResponse = {
  user: AuthUser;
  accessToken: string;
};

const TOKEN_KEY = "access_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
  document.cookie = `access_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  document.cookie = "access_token=; path=/; max-age=0";
}

async function parseResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      typeof data.message === "string"
        ? data.message
        : Array.isArray(data.message)
          ? data.message.join(", ")
          : "Request failed";
    throw new Error(message);
  }

  return data as T;
}

export async function login(email: string, password: string) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await parseResponse<AuthResponse>(response);
  setToken(data.accessToken);
  return data;
}

export async function register(email: string, password: string) {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await parseResponse<AuthResponse>(response);
  setToken(data.accessToken);
  return data;
}

export async function getCurrentUser() {
  const token = getToken();
  if (!token) return null;

  const response = await fetch("/api/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    clearToken();
    return null;
  }

  return parseResponse<AuthUser>(response);
}

export function logout() {
  clearToken();
}
