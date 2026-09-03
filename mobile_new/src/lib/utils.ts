import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Extracts 1-2 uppercase letter initials from a name.
 * Discards numbers and special characters to prevent numeric avatars like "45".
 * Supports English and Indian regional Unicode letters.
 */
export function getInitials(name?: string): string {
  if (!name) return "KA";
  const trimmed = name.trim();
  if (!trimmed) return "KA";

  // Split into words
  const words = trimmed.split(/\s+/).filter(Boolean);
  
  // Extract first letter of each word that is an alphabetic character
  const letters: string[] = [];
  for (const word of words) {
    const match = word.match(/\p{L}/u);
    if (match) {
      letters.push(match[0].toUpperCase());
    }
  }

  const first = letters[0];
  const second = letters[1];
  if (first && second) {
    return first + second;
  }
  if (first) {
    const allLetters = trimmed.replace(/[^\p{L}]/gu, "");
    return allLetters.slice(0, 2).toUpperCase() || first;
  }

  return "KA"; // Fallback to Kalasangam
}

