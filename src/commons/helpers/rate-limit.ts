/**
 * Rate limiting utility for contact form submissions
 */

const RATE_LIMIT_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const STORAGE_KEY = "contact_form_last_submit";

export interface RateLimitResult {
  allowed: boolean;
  remainingTime?: number; // in seconds
}

/**
 * Check if the user can submit the contact form based on rate limiting
 * @returns RateLimitResult indicating if submission is allowed and remaining wait time
 */
export function checkContactRateLimit(): RateLimitResult {
  if (typeof window === "undefined") {
    return { allowed: true };
  }

  const lastSubmitTime = localStorage.getItem(STORAGE_KEY);

  if (!lastSubmitTime) {
    return { allowed: true };
  }

  const lastSubmitTimestamp = parseInt(lastSubmitTime, 10);
  const currentTime = Date.now();
  const timeSinceLastSubmit = currentTime - lastSubmitTimestamp;

  if (timeSinceLastSubmit >= RATE_LIMIT_DURATION) {
    return { allowed: true };
  }

  const remainingTime = Math.ceil(
    (RATE_LIMIT_DURATION - timeSinceLastSubmit) / 1000
  );

  return {
    allowed: false,
    remainingTime,
  };
}

/**
 * Record a successful contact form submission
 */
export function recordContactSubmission(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(STORAGE_KEY, Date.now().toString());
}

/**
 * Format remaining time for display
 * @param seconds - Remaining seconds
 * @returns Formatted string like "4:30" or "0:45"
 */
export function formatRemainingTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}
