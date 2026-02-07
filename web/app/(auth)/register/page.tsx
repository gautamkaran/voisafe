"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { UserPlus, AlertCircle } from "lucide-react";

import { registerSchema, type RegisterFormData } from "@/schemas/complaint";
import { authAPI } from "@/lib/api";
import { saveAuth } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { FormField } from "@/components/ui/FormField";

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            college: "",
            studentId: "",
            department: "",
            year: 1,
        },
    });

    const onSubmit = async (data: RegisterFormData) => {
        if (!agreeToTerms) {
            toast.error("Please agree to the terms and conditions");
            return;
        }

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

                toast.success("Welcome to VoiSafe! Registration successful!");

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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4 py-12">
            <Card className="w-full max-w-2xl shadow-lg">
                <CardHeader className="space-y-1 text-center pb-2">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg">
                            <UserPlus className="w-8 h-8 text-blue-600" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">Create Your Account</CardTitle>
                    <CardDescription>
                        Join VoiSafe and start reporting safely and anonymously
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Info Box */}
                    <Alert variant="info" className="mb-6">
                        <strong>Your privacy is important:</strong> Your identity will never be shared with your complaints
                    </Alert>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                label="Full Name"
                                error={errors.name?.message}
                                required
                            >
                                <Input
                                    type="text"
                                    placeholder="John Doe"
                                    {...register("name")}
                                    className={errors.name ? "border-red-500" : ""}
                                />
                            </FormField>

                            <FormField
                                label="Email Address"
                                error={errors.email?.message}
                                required
                            >
                                <Input
                                    type="email"
                                    placeholder="your.email@college.edu"
                                    {...register("email")}
                                    className={errors.email ? "border-red-500" : ""}
                                />
                            </FormField>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                label="Password"
                                error={errors.password?.message}
                                hint="At least 8 characters"
                                required
                            >
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    {...register("password")}
                                    className={errors.password ? "border-red-500" : ""}
                                />
                            </FormField>

                            <FormField
                                label="Confirm Password"
                                error={errors.confirmPassword?.message}
                                required
                            >
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    {...register("confirmPassword")}
                                    className={errors.confirmPassword ? "border-red-500" : ""}
                                />
                            </FormField>
                        </div>

                        <FormField
                            label="College/Institution"
                            error={errors.college?.message}
                            required
                        >
                            <Input
                                type="text"
                                placeholder="ABC University"
                                {...register("college")}
                                className={errors.college ? "border-red-500" : ""}
                            />
                        </FormField>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                label="Student ID"
                                error={errors.studentId?.message}
                                required
                            >
                                <Input
                                    type="text"
                                    placeholder="STU123456"
                                    {...register("studentId")}
                                    className={errors.studentId ? "border-red-500" : ""}
                                />
                            </FormField>

                            <FormField
                                label="Department"
                                error={errors.department?.message}
                                required
                            >
                                <Input
                                    type="text"
                                    placeholder="Computer Science"
                                    {...register("department")}
                                    className={errors.department ? "border-red-500" : ""}
                                />
                            </FormField>
                        </div>

                        <FormField
                            label="Year of Study"
                            error={errors.year?.message}
                            required
                        >
                            <select
                                {...register("year", { valueAsNumber: true })}
                                className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value={1}>1st Year</option>
                                <option value={2}>2nd Year</option>
                                <option value={3}>3rd Year</option>
                                <option value={4}>4th Year</option>
                                <option value={5}>5th Year</option>
                            </select>
                        </FormField>

                        {/* Terms and Conditions */}
                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={agreeToTerms}
                                onChange={(e) => setAgreeToTerms(e.target.checked)}
                                className="w-4 h-4 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                            />
                            <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
                                I agree to VoiSafe&apos;s{" "}
                                <Link href="#" className="text-blue-600 hover:underline font-medium">
                                    Terms of Service
                                </Link>
                                {" "}and{" "}
                                <Link href="#" className="text-blue-600 hover:underline font-medium">
                                    Privacy Policy
                                </Link>
                            </label>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="inline-block w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Creating Account...
                                </>
                            ) : (
                                "Create Account"
                            )}
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">
                                    Already registered?
                                </span>
                            </div>
                        </div>

                        <Link href="/login" className="block">
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                            >
                                Sign In to Your Account
                            </Button>
                        </Link>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
