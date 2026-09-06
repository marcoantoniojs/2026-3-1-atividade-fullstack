import { request } from "./api";

const STATE_KEY = "diatinf-x:suap-state";

export async function startSuapLogin() {
  const { url, state } = await request<{ url: string; state: string }>("/auth/suap/url");
  sessionStorage.setItem(STATE_KEY, state);
  window.location.assign(url);
}

export function consumeSuapState() {
  const state = sessionStorage.getItem(STATE_KEY);
  sessionStorage.removeItem(STATE_KEY);
  return state;
}
