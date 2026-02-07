"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { LogIn } from "lucide-react";

import { loginSchema, type LoginFormData } from "@/schemas/complaint";
import { authAPI } from "@/lib/api";
import { saveAuth } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { FormField } from "@/components/ui/FormField";

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "john.doe@college.edu",
            password: "password123",
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);

        try {
            const response = await authAPI.login(data.email, data.password);

            if (response.data.success) {
                const { token, user, organization } = response.data.data;

                // Save auth data
                saveAuth(token, user, organization);

                toast.success("Login successful!");

                // Redirect to dashboard
                router.push("/dashboard");
            }
        } catch (error: unknown) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const message = (error as any).response?.data?.message || "Login failed. Please try again.";
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="space-y-1 text-center pb-2">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg">
                            <LogIn className="w-8 h-8 text-blue-600" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
                    <CardDescription>
                        Sign in to your VoiSafe account
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Info Alert */}
                    <Alert variant="info" onClose={undefined}>
                        <strong>Demo Credentials:</strong> Use email john.doe@college.edu with password password123
                    </Alert>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

                        <FormField
                            label="Password"
                            error={errors.password?.message}
                            required
                        >
                            <Input
                                type="password"
                                placeholder="••••••••"
                                {...register("password")}
                                className={errors.password ? "border-red-500" : ""}
                            />
                        </FormField>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="inline-block w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">
                                    New to VoiSafe?
                                </span>
                            </div>
                        </div>

                        <Link href="/register" className="block">
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                            >
                                Create Account
                            </Button>
                        </Link>
                    </form>

                    <p className="text-center text-xs text-gray-500">
                        By signing in, you agree to our Terms of Service and Privacy Policy
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
