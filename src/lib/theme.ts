
export function toggleTheme() {
  const root = document.documentElement;
  const next = root.dataset.theme === "light" ? "" : "light";
  root.dataset.theme = next;
  document.cookie = `theme=${next};path=/;max-age=31536000;SameSite=Lax`;
  return next === "light";
}
