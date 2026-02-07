"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    MessageSquare,
    CheckCircle2,
    Clock,
    AlertTriangle,
    FileText
} from "lucide-react";
import { complaintAPI } from "@/lib/api";
import { Complaint } from "@/types";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { getStatusColor, formatRelativeTime } from "@/lib/utils";
import { toast } from "sonner";

export default function CommitteeComplaintDetailPage() {
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
            await complaintAPI.updateStatus(complaint._id, newStatus, "Status updated by Committee Member");
            toast.success(`Status updated to ${newStatus}`);
            fetchComplaint(complaint._id); // Refresh
        } catch {
            toast.error("Failed to update status");
        }
    };

    if (isLoading) return <div className="p-8 text-center text-slate-500">Loading details...</div>;
    if (!complaint) return <div className="p-8 text-center text-slate-500">Complaint not found</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Button variant="ghost" className="mb-4 text-slate-600" onClick={() => router.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Workspace
            </Button>

            {/* Header Section */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{complaint.title}</h1>
                    <div className="flex items-center gap-3 mt-2">
                        <span className="text-sm text-slate-500">#{complaint.trackingId}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-sm text-slate-600 font-medium uppercase tracking-wide">{complaint.category.replace("-", " ")}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-sm text-slate-500">{formatRelativeTime(complaint.createdAt)}</span>
                    </div>
                </div>
                <Button variant="outline" onClick={() => router.push(`/chat/${complaint.trackingId}`)}>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Open Chat
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center text-lg text-slate-800">
                                <FileText className="w-5 h-5 mr-2 text-indigo-600" />
                                Complaint Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">
                                {complaint.description}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Timeline */}
                    <Card>
                        <CardHeader><CardTitle className="text-base">History</CardTitle></CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {complaint.statusHistory?.map((history: { status: string; changedAt: string }, index: number) => (
                                    <div key={index} className="flex gap-3">
                                        <div className="w-2 h-2 rounded-full bg-slate-200 mt-2 ring-4 ring-white" />
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">
                                                Status: <span className="capitalize">{history.status}</span>
                                            </p>
                                            <p className="text-xs text-slate-500">{formatRelativeTime(history.changedAt)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Actions */}
                <div className="space-y-6">
                    <Card className="border-indigo-100 bg-indigo-50/50">
                        <CardHeader>
                            <CardTitle className="text-base text-indigo-900">Action Required</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="mb-4">
                                <span className="text-xs text-slate-500 font-semibold uppercase">Current Status</span>
                                <div className={`inline-flex items-center px-3 py-1 mt-1 rounded-full text-sm font-medium border ${getStatusColor(complaint.status)}`}>
                                    {complaint.status}
                                </div>
                            </div>

                            <Button
                                size="sm"
                                className="w-full justify-start bg-white hover:bg-slate-50 text-slate-700 border border-slate-200"
                                onClick={() => handleStatusUpdate("in-progress")}
                            >
                                <Clock className="w-4 h-4 mr-2 text-indigo-500" />
                                Mark as In Progress
                            </Button>

                            <Button
                                size="sm"
                                className="w-full justify-start bg-white hover:bg-slate-50 text-slate-700 border border-slate-200"
                                onClick={() => handleStatusUpdate("resolved")}
                            >
                                <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                                Mark as Resolved
                            </Button>

                            <Button
                                size="sm"
                                className="w-full justify-start bg-white hover:bg-slate-50 text-slate-700 border border-slate-200"
                                onClick={() => handleStatusUpdate("under-review")}
                            >
                                <AlertTriangle className="w-4 h-4 mr-2 text-amber-500" />
                                Needs Review
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
