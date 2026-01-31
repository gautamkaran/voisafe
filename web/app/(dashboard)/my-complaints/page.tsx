"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MessageSquare, Eye } from "lucide-react";

import { Complaint } from "@/types";
import { complaintAPI } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatDateTime, getStatusColor } from "@/lib/utils";

export default function MyComplaintsPage() {
    const router = useRouter();
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchComplaints();
    }, []);

    useEffect(() => {
        if (searchQuery.trim()) {
            const filtered = complaints.filter(
                (c) =>
                    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    c.trackingId.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredComplaints(filtered);
        } else {
            setFilteredComplaints(complaints);
        }
    }, [searchQuery, complaints]);

    const fetchComplaints = async () => {
        try {
            const response = await complaintAPI.getMyComplaints();
            if (response.data.success) {
                setComplaints(response.data.data.complaints);
                setFilteredComplaints(response.data.data.complaints);
            }
        } catch (error) {
            console.error("Failed to fetch complaints:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">My Complaints</h1>
                <p className="text-gray-600">
                    View and track all your submitted complaints
                </p>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                    placeholder="Search by title or tracking ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Complaints List */}
            {isLoading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : filteredComplaints.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-gray-600">
                            {searchQuery ? "No complaints found matching your search." : "You haven't submitted any complaints yet."}
                        </p>
                        {!searchQuery && (
                            <Button
                                onClick={() => router.push("/submit-complaint")}
                                className="mt-4"
                            >
                                Submit Your First Complaint
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {filteredComplaints.map((complaint) => (
                        <Card key={complaint._id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                                                {complaint.title}
                                            </h3>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap ${getStatusColor(complaint.status)}`}>
                                                {complaint.status.replace("-", " ")}
                                            </span>
                                        </div>

                                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                                            {complaint.description}
                                        </p>

                                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                            <div>
                                                <span className="font-medium">Tracking ID:</span>{" "}
                                                <code className="text-blue-600 font-mono">{complaint.trackingId}</code>
                                            </div>
                                            <div>
                                                <span className="font-medium">Category:</span>{" "}
                                                <span className="capitalize">{complaint.category.replace("-", " ")}</span>
                                            </div>
                                            <div>
                                                <span className="font-medium">Submitted:</span>{" "}
                                                {formatDateTime(complaint.createdAt)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Button
                                            size="sm"
                                            onClick={() => router.push(`/track/${complaint.trackingId}`)}
                                        >
                                            <Eye className="w-4 h-4 mr-2" />
                                            View
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => router.push(`/chat/${complaint.trackingId}`)}
                                        >
                                            <MessageSquare className="w-4 h-4 mr-2" />
                                            Chat
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
