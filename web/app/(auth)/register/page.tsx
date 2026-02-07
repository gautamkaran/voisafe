"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";

import { registerSchema, type RegisterFormData } from "@/schemas/complaint";
import { authAPI } from "@/lib/api";
import { saveAuth } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "John Doe",
            email: "john.doe@college.edu",
            password: "password123",
            confirmPassword: "password123",
            college: "ABC University",
            studentId: "STU123456",
            department: "Computer Science",
            year: 2,
        },
    });

    const onSubmit = async (data: RegisterFormData) => {
        setIsLoading(true);

        try {
            const response = await authAPI.register({
                ...data,
                role: "student", // Default role for registration
            });

            if (response.data.success) {
                const { token, user } = response.data.data;

                // Save auth data
                saveAuth(token, user);

                toast.success("Registration successful!");

                // Redirect to dashboard
                router.push("/dashboard");
            }
        } catch (error: unknown) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const message = (error as any).response?.data?.message || "Registration failed. Please try again.";
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <UserPlus className="w-8 h-8 text-blue-600" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">Create Your Account</CardTitle>
                    <CardDescription>
                        Register to submit anonymous complaints and track their status
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Full Name"
                                placeholder="John Doe"
                                error={errors.name?.message}
                                {...register("name")}
                                required
                            />

                            <Input
                                label="Email"
                                type="email"
                                placeholder="your.email@college.edu"
                                error={errors.email?.message}
                                {...register("email")}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Password"
                                type="password"
                                placeholder="••••••••"
                                error={errors.password?.message}
                                {...register("password")}
                                required
                            />

                            <Input
                                label="Confirm Password"
                                type="password"
                                placeholder="••••••••"
                                error={errors.confirmPassword?.message}
                                {...register("confirmPassword")}
                                required
                            />
                        </div>

                        <Input
                            label="College/Institution"
                            placeholder="ABC University"
                            error={errors.college?.message}
                            {...register("college")}
                            required
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Student ID"
                                placeholder="STU123456"
                                error={errors.studentId?.message}
                                {...register("studentId")}
                                required
                            />

                            <Input
                                label="Department"
                                placeholder="Computer Science"
                                error={errors.department?.message}
                                {...register("department")}
                                required
                            />
                        </div>

                        <Input
                            label="Year of Study"
                            type="number"
                            placeholder="1"
                            min={1}
                            max={5}
                            error={errors.year?.message}
                            {...register("year", { valueAsNumber: true })}
                            required
                        />

                        <Button
                            type="submit"
                            className="w-full"
                            isLoading={isLoading}
                        >
                            {isLoading ? "Creating account..." : "Create Account"}
                        </Button>

                        <p className="text-center text-sm text-gray-600">
                            Already have an account?{" "}
                            <Link href="/login" className="text-blue-600 hover:underline font-medium">
                                Login here
                            </Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
