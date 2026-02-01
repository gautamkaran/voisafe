"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    MoreHorizontal,
    ShieldAlert,
    MessageSquare,
    CheckCircle2,
    Clock,
    AlertTriangle
} from "lucide-react";
import { complaintAPI } from "@/lib/api";
import { Complaint } from "@/types";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { getStatusColor, formatRelativeTime } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminComplaintDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [complaint, setComplaint] = useState<Complaint | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            fetchComplaint(params.id as string);
        }
    }, [params.id]);

    const fetchComplaint = async (id: string) => {
        try {
            const response = await complaintAPI.getComplaintById(id);
            if (response.data.success) {
                setComplaint(response.data.data.complaint);
            }
        } catch (error) {
            console.error("Failed to fetch complaint:", error);
            toast.error("Failed to load complaint details");
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusUpdate = async (newStatus: string) => {
        if (!complaint) return;
        try {
            await complaintAPI.updateStatus(complaint._id, newStatus, "Status updated via Admin Console");
            toast.success(`Status updated to ${newStatus}`);
            fetchComplaint(complaint._id); // Refresh
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const handleRevealIdentity = async () => {
        // Mock implementation for now - fully implemented in backend
        toast.info("This action requires higher level authorization confirmation (Demo Mode)");
    };

    if (isLoading) return <div className="p-8 text-center text-gray-500">Loading details...</div>;
    if (!complaint) return <div className="p-8 text-center text-gray-500">Complaint not found</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Button variant="ghost" className="mb-4" onClick={() => router.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Complaints
            </Button>

            {/* Header Section */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{complaint.title}</h1>
                    <div className="flex items-center gap-3 mt-2">
                        <span className="text-sm text-gray-500">ID: {complaint.trackingId}</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-sm text-gray-500 capitalize">{complaint.category.replace("-", " ")}</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-sm text-gray-500">{formatRelativeTime(complaint.createdAt)}</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.push(`/chat/${complaint.trackingId}`)}>
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Chat with Student
                    </Button>
                    {/* Only show Reveal Identity for Admins (controlled by API mostly, but UI hint here) */}
                    <Button variant="destructive" onClick={handleRevealIdentity}>
                        <ShieldAlert className="w-4 h-4 mr-2" />
                        Reveal Identity
                    </Button>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Left Column: Description & Details */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardContent className="pt-6">
                            <h3 className="text-sm font-semibold text-gray-900 mb-2">Description</h3>
                            <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                                {complaint.description}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Timeline / Activity Log (Placeholder) */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Activity Log</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {complaint.statusHistory?.map((history: any, index: number) => (
                                    <div key={index} className="flex gap-3">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                Status changed to <span className="capitalize">{history.status}</span>
                                            </p>
                                            <p className="text-xs text-gray-500">{formatRelativeTime(history.changedAt)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Actions & Meta */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Status Management</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 mb-4">
                                <span className="text-xs text-gray-500 uppercase font-bold tracking-wider block mb-1">Current Status</span>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium border ${getStatusColor(complaint.status)}`}>
                                    {complaint.status}
                                </span>
                            </div>

                            <label className="text-sm font-medium text-gray-700 block">Update Status</label>
                            <div className="grid grid-cols-1 gap-2">
                                <Button
                                    size="sm"
                                    variant={complaint.status === "in-progress" ? "default" : "outline"}
                                    onClick={() => handleStatusUpdate("in-progress")}
                                    className="justify-start"
                                >
                                    <Clock className="w-4 h-4 mr-2 text-blue-500" />
                                    Mark In Progress
                                </Button>
                                <Button
                                    size="sm"
                                    variant={complaint.status === "resolved" ? "default" : "outline"}
                                    onClick={() => handleStatusUpdate("resolved")}
                                    className="justify-start"
                                >
                                    <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                                    Mark Resolved
                                </Button>
                                <Button
                                    size="sm"
                                    variant={complaint.status === "under-review" ? "default" : "outline"}
                                    onClick={() => handleStatusUpdate("under-review")}
                                    className="justify-start"
                                >
                                    <AlertTriangle className="w-4 h-4 mr-2 text-amber-500" />
                                    Under Review
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
