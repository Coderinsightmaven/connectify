import { type ClassValue, clsx } from "clsx"
import moment from "./moment-config"

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

// Legacy function - use TimeAgo component or useTime hook instead
export function formatTimeAgo(date: Date): string {
  return moment(date).fromNow()
} 