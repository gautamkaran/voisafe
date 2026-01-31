"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    FileText,
    AlertCircle,
    CheckCircle2,
    ArrowRight,
    ArrowLeft,
    Shield,
    Users,
    BookOpen,
    Building,
    Briefcase,
    HelpCircle
} from "lucide-react";

import { complaintSchema, type ComplaintFormData } from "@/schemas/complaint";
import { complaintAPI } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

const categories = [
    { value: "harassment", label: "Harassment", icon: AlertCircle, color: "text-red-600 bg-red-50" },
    { value: "discrimination", label: "Discrimination", icon: Users, color: "text-orange-600 bg-orange-50" },
    { value: "academic-misconduct", label: "Academic Misconduct", icon: BookOpen, color: "text-purple-600 bg-purple-50" },
    { value: "infrastructure", label: "Infrastructure", icon: Building, color: "text-blue-600 bg-blue-50" },
    { value: "safety", label: "Safety", icon: Shield, color: "text-green-600 bg-green-50" },
    { value: "administration", label: "Administration", icon: Briefcase, color: "text-indigo-600 bg-indigo-50" },
    { value: "other", label: "Other", icon: HelpCircle, color: "text-gray-600 bg-gray-50" },
];

export default function SubmitComplaintPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [trackingId, setTrackingId] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<ComplaintFormData>({
        resolver: zodResolver(complaintSchema),
    });

    const selectedCategory = watch("category");

    const onSubmit = async (data: ComplaintFormData) => {
        setIsLoading(true);

        try {
            const response = await complaintAPI.fileComplaint(data);

            if (response.data.success) {
                const { trackingId: id } = response.data.data;
                setTrackingId(id);
                setStep(4); // Success step
                toast.success("Complaint submitted successfully!");
            }
        } catch (error: any) {
            const message = error.response?.data?.message || "Failed to submit complaint. Please try again.";
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
    const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit Anonymous Complaint</h1>
                <p className="text-gray-600">
                    Your identity is protected. Only use your tracking ID to check status.
                </p>
            </div>

            {/* Progress Steps */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    {[1, 2, 3].map((num) => (
                        <div key={num} className="flex items-center flex-1">
                            <div
                                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${step >= num
                                        ? "bg-blue-600 border-blue-600 text-white"
                                        : "border-gray-300 text-gray-400"
                                    }`}
                            >
                                {step > num ? <CheckCircle2 className="w-5 h-5" /> : num}
                            </div>
                            {num < 3 && (
                                <div
                                    className={`flex-1 h-1 mx-2 transition-colors ${step > num ? "bg-blue-600" : "bg-gray-200"
                                        }`}
                                />
                            )}
                        </div>
                    ))}
                </div>
                <div className="flex justify-between mt-2">
                    <span className="text-xs text-gray-600">Details</span>
                    <span className="text-xs text-gray-600">Category</span>
                    <span className="text-xs text-gray-600">Review</span>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Step 1: Complaint Details */}
                {step === 1 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Complaint Details</CardTitle>
                            <CardDescription>
                                Provide a clear title and detailed description of your grievance
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Input
                                label="Title"
                                placeholder="Brief summary of your complaint"
                                error={errors.title?.message}
                                {...register("title")}
                                required
                            />

                            <Textarea
                                label="Description"
                                placeholder="Provide detailed information about the incident, including dates, locations, and any relevant context..."
                                rows={8}
                                error={errors.description?.message}
                                {...register("description")}
                                required
                            />

                            <div className="flex justify-end">
                                <Button type="button" onClick={nextStep}>
                                    Next <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Step 2: Category Selection */}
                {step === 2 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Select Category</CardTitle>
                            <CardDescription>
                                Choose the category that best describes your complaint
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {categories.map((category) => (
                                    <button
                                        key={category.value}
                                        type="button"
                                        onClick={() => setValue("category", category.value as any)}
                                        className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${selectedCategory === category.value
                                                ? "border-blue-600 bg-blue-50"
                                                : "border-gray-200 hover:border-gray-300"
                                            }`}
                                    >
                                        <div className={`p-3 rounded-lg ${category.color}`}>
                                            <category.icon className="w-6 h-6" />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-medium text-gray-900">{category.label}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                            {errors.category && (
                                <p className="text-sm text-red-600">{errors.category.message}</p>
                            )}

                            <div className="flex justify-between">
                                <Button type="button" variant="outline" onClick={prevStep}>
                                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                                </Button>
                                <Button type="button" onClick={nextStep}>
                                    Next <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Step 3: Review & Submit */}
                {step === 3 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Review & Submit</CardTitle>
                            <CardDescription>
                                Please review your complaint before submitting
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                                    <div>
                                        <h4 className="font-medium text-blue-900 mb-1">Anonymous Submission</h4>
                                        <p className="text-sm text-blue-700">
                                            Your identity will not be stored with this complaint. You will receive a unique tracking ID to check the status.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Title</label>
                                    <p className="mt-1 text-gray-900">{watch("title")}</p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700">Category</label>
                                    <p className="mt-1 text-gray-900">
                                        {categories.find((c) => c.value === selectedCategory)?.label}
                                    </p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700">Description</label>
                                    <p className="mt-1 text-gray-900 whitespace-pre-wrap">{watch("description")}</p>
                                </div>
                            </div>

                            <div className="flex justify-between">
                                <Button type="button" variant="outline" onClick={prevStep}>
                                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                                </Button>
                                <Button type="submit" isLoading={isLoading}>
                                    {isLoading ? "Submitting..." : "Submit Complaint"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Step 4: Success */}
                {step === 4 && trackingId && (
                    <Card>
                        <CardContent className="py-12">
                            <div className="text-center space-y-6">
                                <div className="flex justify-center">
                                    <div className="p-4 bg-green-100 rounded-full">
                                        <CheckCircle2 className="w-16 h-16 text-green-600" />
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                        Complaint Submitted Successfully!
                                    </h2>
                                    <p className="text-gray-600">
                                        Your complaint has been filed anonymously. Save your tracking ID below.
                                    </p>
                                </div>

                                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Your Tracking ID
                                    </label>
                                    <div className="flex items-center justify-center gap-4">
                                        <code className="text-2xl font-mono font-bold text-blue-600">
                                            {trackingId}
                                        </code>
                                        <Button
                                            type="button"
                                            size="sm"
                                            onClick={() => {
                                                navigator.clipboard.writeText(trackingId);
                                                toast.success("Tracking ID copied!");
                                            }}
                                        >
                                            Copy
                                        </Button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Save this ID to track your complaint status
                                    </p>
                                </div>

                                <div className="flex gap-4 justify-center">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => router.push("/my-complaints")}
                                    >
                                        View My Complaints
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={() => router.push(`/track/${trackingId}`)}
                                    >
                                        Track This Complaint
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </form>
        </div>
    );
}
