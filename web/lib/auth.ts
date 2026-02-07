import { User } from "@/types";

/**
 * AUTH HELPER FUNCTIONS
 * 
 * Client-side authentication utilities
 */

/**
 * Save auth data to localStorage
 */
export function saveAuth(token: string, user: User, organization?: any): void { // eslint-disable-line @typescript-eslint/no-explicit-any
    if (typeof window === "undefined") return;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    if (organization) {
        localStorage.setItem("organization", JSON.stringify(organization));
    } else {
        localStorage.removeItem("organization");
    }
}

/**
 * Get current organization from localStorage
 */
export function getOrganization(): any | null { // eslint-disable-line @typescript-eslint/no-explicit-any
    if (typeof window === "undefined") return null;

    const orgStr = localStorage.getItem("organization");
    if (!orgStr) return null;

    try {
        return JSON.parse(orgStr);
    } catch {
        return null;
    }
}

/**
 * Get current user from localStorage
 */
export function getUser(): User | null {
    if (typeof window === "undefined") return null;

    const userStr = localStorage.getItem("user");
    if (!userStr) return null;

    try {
        return JSON.parse(userStr);
    } catch {
        return null;
    }
}

/**
 * Get auth token from localStorage
 */
export function getToken(): string | null {
    if (typeof window === "undefined") return null;

    return localStorage.getItem("token");
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
    return !!getToken();
}

/**
 * Logout user
 */
export function logout(): void {
    if (typeof window === "undefined") return;

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("organization");

    // Redirect to login
    window.location.href = "/login";
}

/**
 * Check if user has specific role
 */
export function hasRole(role: string | string[]): boolean {
    const user = getUser();
    if (!user) return false;

    if (Array.isArray(role)) {
        return role.includes(user.role);
    }

    return user.role === role;
}

/**
 * Check if user is student
 */
export function isStudent(): boolean {
    return hasRole("student");
}

/**
 * Check if user is admin
 */
export function isAdmin(): boolean {
    return hasRole(["admin", "committee-admin"]);
}
