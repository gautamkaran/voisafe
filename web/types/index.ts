/**
 * TYPESCRIPT TYPES FOR VOISAFE FRONTEND
 */

export interface User {
    _id: string;
    name: string;
    email: string;
    role: "student" | "admin" | "committee-admin";
    college: string;
    studentId?: string;
    department?: string;
    year?: number;
    isActive: boolean;
    isVerified: boolean;
    createdAt: string;
    lastLogin?: string;
}

export interface Complaint {
    _id: string;
    trackingId: string;
    title: string;
    description: string;
    category: ComplaintCategory;
    priority: "low" | "medium" | "high" | "urgent";
    status: ComplaintStatus;
    college: string;
    attachments?: Attachment[];
    adminNotes?: AdminNote[];
    statusHistory: StatusHistory[];
    identityRevealed: boolean;
    identityRevealedBy?: string;
    identityRevealedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export type ComplaintCategory =
    | "harassment"
    | "discrimination"
    | "academic-misconduct"
    | "infrastructure"
    | "safety"
    | "administration"
    | "other";

export type ComplaintStatus =
    | "pending"
    | "under-review"
    | "in-progress"
    | "resolved"
    | "closed";

export interface Attachment {
    filename: string;
    url: string;
    uploadedAt: string;
}

export interface AdminNote {
    note: string;
    addedBy: string;
    addedAt: string;
}

export interface StatusHistory {
    status: ComplaintStatus;
    changedBy: string;
    changedAt: string;
    comment?: string;
}

export interface ChatMessage {
    _id: string;
    trackingId: string;
    senderRole: "student" | "admin" | "committee-admin" | "system";
    adminId?: string;
    message: string;
    messageType: "text" | "file" | "system";
    attachment?: {
        filename: string;
        url: string;
        fileType: string;
        fileSize: number;
    };
    isRead: boolean;
    readAt?: string;
    createdAt: string;
    senderName?: string; // Only for admin messages
}

export interface ComplaintFormData {
    title: string;
    description: string;
    category: ComplaintCategory;
}

export interface LoginFormData {
    email: string;
    password: string;
}

export interface RegisterFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    college: string;
    studentId: string;
    department: string;
    year: number;
}

export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    count?: number;
}

export interface ApiError {
    success: false;
    message: string;
    error?: string;
}
