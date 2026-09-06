const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3333";
const TOKEN_KEY = "diatinf-x:token";

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly details?: { field: string; message: string }[]
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  query?: Record<string, string | number | undefined | null>;
};

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = new URL(path, BASE_URL);

  for (const [key, value] of Object.entries(options.query ?? {})) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  const token = getToken();

  const response = await fetch(url, {
    method: options.method ?? "GET",
    headers: {
      ...(options.body === undefined ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const error = payload as { error?: string; details?: { field: string; message: string }[] } | null;
    throw new ApiError(response.status, error?.error ?? "Não foi possível concluir a operação.", error?.details);
  }

  return payload as T;
}
