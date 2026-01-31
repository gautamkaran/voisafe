"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    Clock,
    CheckCircle2,
    AlertCircle,
    MessageSquare,
    ArrowLeft
} from "lucide-react";

import { Complaint } from "@/types";
import { complaintAPI } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatDateTime, getStatusColor } from "@/lib/utils";

export default function TrackComplaintPage() {
    const params = useParams();
    const router = useRouter();
    const trackingId = params.trackingId as string;

    const [complaint, setComplaint] = useState<Complaint | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchComplaint();
    }, [trackingId]);

    const fetchComplaint = async () => {
        try {
            const response = await complaintAPI.trackComplaint(trackingId);

            if (response.data.success) {
                setComplaint(response.data.data.complaint);
            }
        } catch (error: any) {
            const message = error.response?.data?.message || "Failed to fetch complaint";
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!complaint) {
        return (
            <div className="max-w-2xl mx-auto text-center py-12">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Complaint Not Found</h2>
                <p className="text-gray-600 mb-6">
                    The tracking ID you provided does not match any complaint.
                </p>
                <Button onClick={() => router.push("/my-complaints")}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to My Complaints
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Complaint</h1>
                    <p className="text-gray-600">Tracking ID: <code className="font-mono font-semibold text-blue-600">{trackingId}</code></p>
                </div>
                <Button onClick={() => router.push(`/chat/${trackingId}`)}>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Open Chat
                </Button>
            </div>

            {/* Status Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Current Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(complaint.status)}`}>
                                {complaint.status.replace("-", " ").toUpperCase()}
                            </span>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Priority</p>
                            <p className="font-medium text-gray-900 capitalize">{complaint.priority}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Complaint Details */}
            <Card>
                <CardHeader>
                    <CardTitle>Complaint Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700">Title</label>
                        <p className="mt-1 text-gray-900">{complaint.title}</p>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">Category</label>
                        <p className="mt-1 text-gray-900 capitalize">{complaint.category.replace("-", " ")}</p>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">Description</label>
                        <p className="mt-1 text-gray-900 whitespace-pre-wrap">{complaint.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Submitted</label>
                            <p className="mt-1 text-gray-900">{formatDateTime(complaint.createdAt)}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Last Updated</label>
                            <p className="mt-1 text-gray-900">{formatDateTime(complaint.updatedAt)}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Status Timeline */}
            <Card>
                <CardHeader>
                    <CardTitle>Status History</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {complaint.statusHistory.length > 0 ? (
                            complaint.statusHistory.map((history, index) => (
                                <div key={index} className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="p-2 bg-blue-100 rounded-full">
                                            <CheckCircle2 className="w-4 h-4 text-blue-600" />
                                        </div>
                                        {index < complaint.statusHistory.length - 1 && (
                                            <div className="w-0.5 h-full bg-gray-200 my-1"></div>
                                        )}
                                    </div>
                                    <div className="flex-1 pb-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium text-gray-900 capitalize">
                                                {history.status.replace("-", " ")}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {formatDateTime(history.changedAt)}
                                            </span>
                                        </div>
                                        {history.comment && (
                                            <p className="text-sm text-gray-600">{history.comment}</p>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p>No status updates yet</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
