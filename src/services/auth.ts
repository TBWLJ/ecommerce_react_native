import { requestJson } from "@/lib/api";
import { AuthRole, AuthUser } from "@/types/models";

type AuthPayload = {
  token?: string;
  accessToken?: string;
  user?: unknown;
  data?: unknown;
};

export type AuthResult = { token: string; user: AuthUser };

const toUser = (value: unknown): AuthUser => {
  if (!value || typeof value !== "object") {
    throw new Error("The backend returned an invalid user.");
  }

  const raw = value as Record<string, unknown>;
  const role: AuthRole = raw.role === "admin" || raw.isAdmin === true ? "admin" : "customer";
  const id = String(raw._id || raw.id || raw.userId || "");
  const email = String(raw.email || "");
  const name = String(raw.name || raw.fullName || raw.username || email);

  if (!id || !email) {
    throw new Error("The backend returned an incomplete user.");
  }

  return {
    id,
    name,
    email,
    avatar: String(
      raw.avatar || raw.avatarUrl ||
        `https://i.pravatar.cc/150?u=${encodeURIComponent(email)}`
    ),
    role,
  };
};

const normalizeAuthResponse = (payload: AuthPayload): AuthResult => {
  const token = String(payload.token || payload.accessToken || "");
  const rawUser = payload.user || payload.data;
  if (!token || !rawUser) {
    throw new Error("The backend returned an invalid authentication response.");
  }
  return { token, user: toUser(rawUser) };
};

export function login(email: string, password: string) {
  return requestJson<AuthPayload>("/users/login", {
    method: "POST",
    body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
  }).then(normalizeAuthResponse);
}

export function register(name: string, email: string, password: string) {
  return requestJson<{ id: string }>("/users/register", {
    method: "POST",
    body: JSON.stringify({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    }),
  }).then(() => login(email, password));
}

export function logout(token: string | null) {
  return requestJson<{ message: string }>("/users/logout", { method: "POST" }, token);
}
