"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckSquare, AlertCircle, Clock, CheckCircle2, MoreHorizontal } from "lucide-react";
import { complaintAPI } from "@/lib/api";
import { Complaint } from "@/types";
import { formatRelativeTime, getStatusColor } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export default function CommitteeWorkspacePage() {
    const router = useRouter();
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const response = await complaintAPI.getAllComplaints();
            if (response.data.success) {
                setComplaints(response.data.data.complaints);
            }
        } catch (error) {
            console.error("Failed to fetch complaints:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const activeComplaints = complaints.filter(c => !["resolved", "closed"].includes(c.status));

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">My Workspace</h1>

            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                    <h2 className="font-semibold text-slate-700 flex items-center">
                        <CheckSquare className="w-5 h-5 mr-2 text-indigo-600" />
                        Active Grievances
                    </h2>
                    <span className="bg-indigo-100 text-indigo-700 text-xs px-2.5 py-0.5 rounded-full font-medium">
                        {activeComplaints.length} Active
                    </span>
                </div>

                <div className="divide-y divide-slate-100">
                    {isLoading ? (
                        <div className="p-8 text-center text-slate-500">Loading complaints...</div>
                    ) : complaints.length === 0 ? (
                        <div className="p-12 text-center text-slate-500">
                            <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                            <p>No complaints found.</p>
                        </div>
                    ) : (
                        complaints.map((complaint) => (
                            <div
                                key={complaint._id}
                                className="p-6 hover:bg-slate-50 transition-colors cursor-pointer group"
                                onClick={() => router.push(`/admin/complaints/${complaint._id}`)} // Re-using admin detail view for now
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1 min-w-0 pr-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(complaint.status)}`}>
                                                {complaint.status}
                                            </span>
                                            <span className="text-xs text-slate-400">•</span>
                                            <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">
                                                {complaint.category}
                                            </span>
                                        </div>
                                        <h3 className="font-medium text-slate-900 group-hover:text-indigo-600 truncate">
                                            {complaint.title}
                                        </h3>
                                        <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                                            {complaint.description}
                                        </p>
                                        <div className="flex items-center mt-3 text-xs text-slate-400">
                                            <Clock className="w-3.5 h-3.5 mr-1" />
                                            {formatRelativeTime(complaint.createdAt)}
                                        </div>
                                    </div>

                                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        View Details
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
