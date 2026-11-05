// Usage: Include this script in the HTML <head>. To prevent FOUC:
// - before any CSS (<link>, <style>)
// - without defer/async/module attribute

const LIGHT = "light";
const DARK = "dark";

// Apply stored theme or system preference. Run immediately (synchronously), sets `data-theme` on `<html>` to prevent FOUC.
const stored = localStorage.getItem("theme");
if (stored) {
  document.documentElement.dataset.theme = stored;
} else {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.dataset.theme = prefersDark ? DARK : LIGHT;
}

// Toggle function between light and dark mode.
window.toggleMode = () => {
  const current = document.documentElement.dataset.theme;
  const next = current === DARK ? LIGHT : DARK;
  document.documentElement.dataset.theme = next;
  localStorage.setItem("theme", next);
  updatePygmentsTheme(next);
};

// Update Pygments CSS based on theme
function updatePygmentsTheme(theme) {
  const pygmentsDarkLink = document.getElementById("pygments_dark_css");
  if (pygmentsDarkLink) {
    // Remove the media query and control via disabled attribute
    pygmentsDarkLink.removeAttribute("media");
    pygmentsDarkLink.disabled = theme !== DARK;
  }
}

// Initialize Pygments theme on page load. Delayed when DOM is ready to find `<link id="pygments_dark_css">`
document.addEventListener("DOMContentLoaded", () => {
  const currentTheme = document.documentElement.dataset.theme;
  updatePygmentsTheme(currentTheme);
});
