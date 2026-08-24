import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a 10-digit Indian number as "XXXXX XXXXX"
 */
export function formatIndianNumber(digits: string): string {
  const clean = digits.replace(/\D/g, "").slice(0, 10);
  if (clean.length <= 5) return clean;
  return `${clean.slice(0, 5)} ${clean.slice(5)}`;
}

/**
 * Mask a formatted number for history display: "+91 98765 •••••"
 */
export function maskNumber(formatted: string): string {
  // formatted is like "+91 98765 43210"
  const parts = formatted.split(" ");
  if (parts.length >= 3) {
    return `${parts[0]} ${parts[1]} •••••`;
  }
  if (parts.length === 2) {
    return `${parts[0]} •••••`;
  }
  return formatted;
}

/**
 * Validate Indian mobile: 10 digits, starts with 6-9
 */
export function isValidIndianMobile(digits: string): boolean {
  const clean = digits.replace(/\D/g, "");
  return clean.length === 10 && /^[6-9]/.test(clean);
}
