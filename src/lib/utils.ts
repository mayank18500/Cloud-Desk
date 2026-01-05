import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getMediaUrl(path: string | undefined | null) {
  if (!path || typeof path !== 'string') return "";

  const trimmedPath = path.trim();
  if (!trimmedPath) return "";

  if (trimmedPath.startsWith('http')) return trimmedPath;

  // Standardize backslashes for local paths
  const normalizedPath = trimmedPath.replace(/\\/g, '/');

  // Clean leading slash if present to avoid double slashes
  const cleanPath = normalizedPath.startsWith('/') ? normalizedPath.slice(1) : normalizedPath;

  return `http://localhost:5000/${cleanPath}`;
}
