"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, User, Shield } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { toast } from "sonner";

export default function AddCommitteeMemberPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "Member",
        department: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Mock API call
        setTimeout(() => {
            toast.success("Invitation sent successfully!");
            setIsLoading(false);
            router.push("/admin/committee");
        }, 1000);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Button variant="ghost" className="mb-4" onClick={() => router.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Committee
            </Button>

            <h1 className="text-2xl font-bold text-gray-900">Add Committee Member</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Member Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center">
                                <User className="w-4 h-4 mr-2" />
                                Full Name
                            </label>
                            <input
                                required
                                type="text"
                                placeholder="e.g. Dr. Anjali Sharma"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center">
                                <Mail className="w-4 h-4 mr-2" />
                                Email Address
                            </label>
                            <input
                                required
                                type="email"
                                placeholder="name@college.edu"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center">
                                    <Shield className="w-4 h-4 mr-2" />
                                    Role
                                </label>
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="Member">Member</option>
                                    <option value="Chairperson">Chairperson</option>
                                    <option value="Secretary">Secretary</option>
                                    <option value="Counselor">Counselor</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Department</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Psychology"
                                    value={formData.department}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <Button type="submit" size="lg" disabled={isLoading}>
                                {isLoading ? "Sending Invitation..." : "Send Invitation"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
