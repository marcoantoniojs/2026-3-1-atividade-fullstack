const UNITS: [limit: number, seconds: number, suffix: string][] = [
  [60, 1, "s"],
  [3600, 60, "m"],
  [86400, 3600, "h"],
  [604800, 86400, "d"],
];

export function relativeTime(value: string) {
  const elapsed = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 1000));

  for (const [limit, seconds, suffix] of UNITS) {
    if (elapsed < limit) {
      return `${Math.max(1, Math.floor(elapsed / seconds))}${suffix}`;
    }
  }

  return new Date(value).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

export function fullDate(value: string) {
  return new Date(value).toLocaleString("pt-BR", { dateStyle: "long", timeStyle: "short" });
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "?";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}
