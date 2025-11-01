// Shared utility for getting the resume URL and filename

/**
 * Returns a safe, absolute URL for the resume PDF or external link.
 * Priority: env var (VITE_RESUME_LINK or RESUME_LINK) > settings.resume.alternativeUrl > settings.resume.url > /resume.pdf
 * @param {object} settings - The settings object (from settings.json)
 * @returns {string} - A safe URL for the resume
 */
export function getResumeUrl(settings) {
    // 1. Check for environment variable (VITE_RESUME_LINK or RESUME_LINK)
    const envResumeUrl = import.meta.env.VITE_RESUME_LINK || import.meta.env.RESUME_LINK;
    if (typeof envResumeUrl === "string" && envResumeUrl.trim() !== "") {
        return sanitizeResumeUrl(envResumeUrl);
    }
    // 2. Fallback to settings.json logic
    const resumeConfig = settings?.resume || {};
    let url =
        (resumeConfig.type === "external" && resumeConfig.alternativeUrl) ? resumeConfig.alternativeUrl : resumeConfig.url;
    if (typeof url === "string" && url.trim() !== "") {
        return sanitizeResumeUrl(url);
    }
    // 3. Default fallback
    return "/resume.pdf";
}

/**
 * Returns a safe filename for the resume download, or undefined to let the browser decide.
 * @param {object} settings - The settings object (from settings.json)
 * @returns {string|undefined} - A safe filename or undefined
 */
export function getResumeFilename(settings) {
    const resumeConfig = settings?.resume || {};
    const filename = resumeConfig.filename;
    if (!filename || typeof filename !== "string") {
        return undefined;
    }
    const sanitizedFilename = filename
        .replace(/[<>:"/\\|?*]/g, "")
        .replace(/\.\./g, "")
        .trim();
    if (sanitizedFilename.length === 0) {
        return undefined;
    }
    return sanitizedFilename;
}

/**
 * Sanitizes a resume URL to prevent XSS and invalid protocols.
 * Allows only http, https, and relative URLs. Falls back to /resume.pdf if unsafe.
 * @param {string} url - The URL to sanitize
 * @returns {string} - A safe URL
 */
function sanitizeResumeUrl(url) {
    if (!url || typeof url !== "string") return "/resume.pdf";
    const trimmed = url.trim();
    // Disallow javascript:, data:, vbscript:
    if (/^(javascript:|data:|vbscript:)/i.test(trimmed)) return "/resume.pdf";
    // Allow only http, https, or relative URLs
    try {
        const parsed = new URL(trimmed, window.location.origin);
        if (parsed.protocol === "http:" || parsed.protocol === "https:") {
            return parsed.href;
        }
        // If it's a relative URL, allow it
        if (trimmed.startsWith("/")) {
            return trimmed;
        }
    } catch {
        // If URL constructor fails, treat as relative if it doesn't contain a colon
        if (!trimmed.includes(":")) {
            return "/" + trimmed.replace(/^\/+/, "");
        }
    }
    return "/resume.pdf";
}
