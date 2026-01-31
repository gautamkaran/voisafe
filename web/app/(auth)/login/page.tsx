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
        } catch (error: any) {
            const message = error.response?.data?.message || "Login failed. Please try again.";
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <LogIn className="w-8 h-8 text-blue-600" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">Welcome to VoiSafe</CardTitle>
                    <CardDescription>
                        Login to access your anonymous grievance dashboard
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <Input
                            label="Email"
                            type="email"
                            placeholder="your.email@college.edu"
                            error={errors.email?.message}
                            {...register("email")}
                            required
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            error={errors.password?.message}
                            {...register("password")}
                            required
                        />

                        <Button
                            type="submit"
                            className="w-full"
                            isLoading={isLoading}
                        >
                            {isLoading ? "Logging in..." : "Login"}
                        </Button>

                        <p className="text-center text-sm text-gray-600">
                            Don't have an account?{" "}
                            <Link href="/register" className="text-blue-600 hover:underline font-medium">
                                Register here
                            </Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
