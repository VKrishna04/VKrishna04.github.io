// Simple Dark Reader Disable
// This prevents Dark Reader extension from interfering with the site

if (typeof window !== "undefined") {
  // Set color scheme to dark
  document.documentElement.style.colorScheme = "dark";

  // Add meta tag to prevent extensions
  const meta = document.createElement("meta");
  meta.name = "color-scheme";
  meta.content = "dark";
  document.head.appendChild(meta);

  // Simple approach - no complex overrides that cause infinite loops
  console.log("Dark Reader interference prevention loaded");
}
