import { z } from "zod";

/**
 * ZOD SCHEMAS FOR FORM VALIDATION
 */

// Complaint submission schema
export const complaintSchema = z.object({
    title: z
        .string()
        .min(5, "Title must be at least 5 characters")
        .max(200, "Title cannot exceed 200 characters"),

    description: z
        .string()
        .min(20, "Description must be at least 20 characters")
        .max(5000, "Description cannot exceed 5000 characters"),

    category: z.enum([
        "harassment",
        "discrimination",
        "academic-misconduct",
        "infrastructure",
        "safety",
        "administration",
        "other",
    ], {
        errorMap: () => ({ message: "Please select a valid category" }),
    }),
});

export type ComplaintFormData = z.infer<typeof complaintSchema>;

// Login schema
export const loginSchema = z.object({
    email: z
        .string()
        .email("Please enter a valid email address"),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Register schema
export const registerSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name cannot exceed 100 characters"),

    email: z
        .string()
        .email("Please enter a valid email address"),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters"),

    confirmPassword: z
        .string(),

    college: z
        .string()
        .min(2, "College name is required"),

    studentId: z
        .string()
        .min(1, "Student ID is required"),

    department: z
        .string()
        .min(2, "Department is required"),

    year: z
        .number()
        .min(1, "Year must be between 1 and 5")
        .max(5, "Year must be between 1 and 5"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export type RegisterFormData = z.infer<typeof registerSchema>;
