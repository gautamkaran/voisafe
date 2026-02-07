"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Filter, ArrowUpDown } from "lucide-react";
import { complaintAPI } from "@/lib/api";
import { Complaint } from "@/types";
import { Button } from "@/components/ui/Button";
import { getStatusColor, formatRelativeTime } from "@/lib/utils";

export default function AdminComplaintsPage() {
    const router = useRouter();
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState("all");

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

    const filteredComplaints = complaints.filter(c =>
        filter === "all" ? true : c.status === filter
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Grievances</h1>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <ArrowUpDown className="w-4 h-4 mr-2" />
                        Sort
                    </Button>
                    <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                    </Button>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    {["all", "pending", "in-progress", "resolved"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`
                                whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm
                                ${filter === status
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}
                            `}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Complaints List */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                {isLoading ? (
                    <div className="p-8 text-center text-gray-500">Loading...</div>
                ) : filteredComplaints.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        No {filter !== "all" ? filter : ""} complaints found.
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {filteredComplaints.map((complaint) => (
                            <li
                                key={complaint._id}
                                className="hover:bg-gray-50 cursor-pointer transition-colors"
                                onClick={() => router.push(`/admin/complaints/${complaint._id}`)}
                            >
                                <div className="px-6 py-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(complaint.status)}`}>
                                                {complaint.status}
                                            </span>
                                            <span className="text-sm text-gray-500">#{complaint.trackingId}</span>
                                        </div>
                                        <div className="text-xs text-gray-500 flex items-center">
                                            <ClockIcon className="w-3 h-3 mr-1" />
                                            {formatRelativeTime(complaint.createdAt)}
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        <h3 className="text-sm font-medium text-gray-900">{complaint.title}</h3>
                                        <p className="text-sm text-gray-500 mt-1 line-clamp-1">{complaint.description}</p>
                                    </div>
                                    <div className="mt-2 text-xs text-gray-400 capitalize">
                                        {complaint.category.replace("-", " ")}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    )
}
