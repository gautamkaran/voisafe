"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    FileText,
    MessageSquare,
    Clock,
    CheckCircle2,
    AlertCircle,
    TrendingUp,
    Plus,
} from "lucide-react";

import { Complaint } from "@/types";
import { complaintAPI } from "@/lib/api";
import { getUser, getOrganization } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { EmptyState } from "@/components/ui/EmptyState";
import { ComplaintsList } from "@/components/ComplaintsList";
import { DashboardSkeleton } from "@/components/LoadingStates";
import { formatRelativeTime } from "@/lib/utils";

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [organization, setOrganization] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any

    useEffect(() => {
        const currentUser = getUser();
        if (!currentUser) {
            router.push("/login");
            return;
        }
        setUser(currentUser);
        setOrganization(getOrganization());
        fetchComplaints();
    }, [router]);

    const fetchComplaints = async () => {
        try {
            const response = await complaintAPI.getMyComplaints();
            if (response.data.success) {
                setComplaints(response.data.data.complaints);
            }
        } catch (error) {
            console.error("Failed to fetch complaints:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const stats = {
        total: complaints.length,
        pending: complaints.filter((c) => c.status === "pending").length,
        resolved: complaints.filter((c) => c.status === "resolved").length,
        inProgress: complaints.filter((c) => ["in-progress", "under-review"].includes(c.status)).length,
    };

    if (isLoading) {
        return <DashboardSkeleton />;
    }

    if (!user) return null;

    const isOrgRestricted = organization?.isVerified === false;

    return (
        <div className="space-y-8">
            {/* Verification Alert */}
            {isOrgRestricted && (
                <Alert variant="warning">
                    <AlertCircle className="w-5 h-5" />
                    <div>
                        <strong>Institution Verification Pending</strong>
                        <p className="text-sm mt-1">
                            Your institution ({organization.name}) is under verification. You'll be able to submit complaints once approval is complete.
                        </p>
                    </div>
                </Alert>
            )}

            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-900">
                    Welcome back, <span className="text-blue-600">{user?.name?.split(" ")[0]}</span>!
                </h1>
                <p className="text-gray-600">
                    Track your anonymous complaints and monitor their progress in real-time.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    {
                        label: "Total Complaints",
                        value: stats.total,
                        icon: FileText,
                        color: "bg-blue-100 text-blue-600",
                    },
                    {
                        label: "Pending",
                        value: stats.pending,
                        icon: Clock,
                        color: "bg-yellow-100 text-yellow-600",
                    },
                    {
                        label: "In Progress",
                        value: stats.inProgress,
                        icon: TrendingUp,
                        color: "bg-purple-100 text-purple-600",
                    },
                    {
                        label: "Resolved",
                        value: stats.resolved,
                        icon: CheckCircle2,
                        color: "bg-green-100 text-green-600",
                    },
                ].map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.label} className="hover:shadow-md transition-shadow">
                            <CardContent className="pt-6">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            {stat.label}
                                        </p>
                                        <p className="text-4xl font-bold text-gray-900 mt-2">
                                            {stat.value}
                                        </p>
                                    </div>
                                    <div className={`p-3 rounded-lg ${stat.color}`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button
                            onClick={() => router.push("/submit-complaint")}
                            className="h-auto py-4 justify-start"
                            disabled={isOrgRestricted}
                        >
                            <Plus className="w-5 h-5 mr-3" />
                            <div className="text-left flex-1">
                                <p className="font-semibold">Submit New Complaint</p>
                                <p className="text-xs opacity-75">File a new anonymous grievance</p>
                            </div>
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => router.push("/my-complaints")}
                            className="h-auto py-4 justify-start"
                        >
                            <FileText className="w-5 h-5 mr-3" />
                            <div className="text-left flex-1">
                                <p className="font-semibold">View All Complaints</p>
                                <p className="text-xs opacity-75">Track and manage your complaints</p>
                            </div>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Recent Complaints */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Recent Complaints</CardTitle>
                            <p className="text-sm text-gray-500 mt-1">
                                Your 5 most recent submissions
                            </p>
                        </div>
                        {complaints.length > 0 && (
                            <Link
                                href="/my-complaints"
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                                View all →
                            </Link>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <ComplaintsList
                        complaints={complaints.slice(0, 5)}
                        onViewClick={(complaint) =>
                            router.push(`/track/${complaint.trackingId}`)
                        }
                        onMessageClick={(complaint) =>
                            router.push(`/chat/${complaint.trackingId}`)
                        }
                        emptyState={
                            <EmptyState
                                icon={FileText}
                                title="No Complaints Yet"
                                description="You haven't submitted any complaints. Start by filing your first anonymous grievance."
                                action={{
                                    label: "Submit Complaint",
                                    onClick: () => router.push("/submit-complaint"),
                                }}
                            />
                        }
                    />
                </CardContent>
            </Card>
        </div>
    );
}
