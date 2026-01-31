import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx and tailwind-merge for optimal class handling
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date | string): string {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return format(dateObj, "MMM dd, yyyy");
}

/**
 * Format date to relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | string): string {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return formatDistanceToNow(dateObj, { addSuffix: true });
}

/**
 * Format date and time
 */
export function formatDateTime(date: Date | string): string {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return format(dateObj, "MMM dd, yyyy 'at' hh:mm a");
}

/**
 * Truncate text to specified length
 */
export function truncate(text: string, length: number): string {
    if (text.length <= length) return text;
    return text.slice(0, length) + "...";
}

/**
 * Get status color for complaint status
 */
export function getStatusColor(status: string): string {
    const colors: Record<string, string> = {
        pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
        "under-review": "bg-blue-100 text-blue-800 border-blue-200",
        "in-progress": "bg-purple-100 text-purple-800 border-purple-200",
        resolved: "bg-green-100 text-green-800 border-green-200",
        closed: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return colors[status] || colors.pending;
}

/**
 * Get category icon name
 */
export function getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
        harassment: "shield-alert",
        discrimination: "users",
        "academic-misconduct": "book-open",
        infrastructure: "building",
        safety: "shield",
        administration: "briefcase",
        other: "help-circle",
    };
    return icons[category] || icons.other;
}
