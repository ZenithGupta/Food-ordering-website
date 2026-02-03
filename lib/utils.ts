import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as EUR currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

/**
 * Validate Dutch postal code format (e.g., "1234 AB")
 */
export function isValidDutchPostalCode(postalCode: string): boolean {
  const regex = /^[1-9][0-9]{3}\s?[A-Za-z]{2}$/;
  return regex.test(postalCode.trim());
}

/**
 * Format Dutch postal code to standard format
 */
export function formatDutchPostalCode(postalCode: string): string {
  const cleaned = postalCode.replace(/\s/g, '').toUpperCase();
  if (cleaned.length === 6) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4)}`;
  }
  return postalCode;
}

/**
 * Generate spice level display
 */
export function getSpiceDisplay(level: number): string {
  return '🌶️'.repeat(level);
}
