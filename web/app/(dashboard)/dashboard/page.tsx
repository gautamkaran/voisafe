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
    Users,
    Building
} from "lucide-react";

import { Complaint } from "@/types";
import { complaintAPI } from "@/lib/api";
import { getUser, isAdmin } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatRelativeTime, getStatusColor } from "@/lib/utils";

// ----------------------------------------------------------------------
// STUDENT DASHBOARD COMPONENT
// ----------------------------------------------------------------------
function StudentDashboard({ user }: { user: any }) {
    const router = useRouter();
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchComplaints();
    }, []);

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

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name}!</h1>
                <p className="text-gray-600">Here's an overview of your complaints and recent activity.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Complaints</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <FileText className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Pending</p>
                                <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pending}</p>
                            </div>
                            <div className="p-3 bg-yellow-100 rounded-lg">
                                <Clock className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">In Progress</p>
                                <p className="text-3xl font-bold text-purple-600 mt-2">{stats.inProgress}</p>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <TrendingUp className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Resolved</p>
                                <p className="text-3xl font-bold text-green-600 mt-2">{stats.resolved}</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-lg">
                                <CheckCircle2 className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button onClick={() => router.push("/submit-complaint")} className="h-auto py-4 justify-start">
                            <FileText className="w-5 h-5 mr-3" />
                            <div className="text-left">
                                <p className="font-semibold">Submit New Complaint</p>
                                <p className="text-sm opacity-90">File a new anonymous grievance</p>
                            </div>
                        </Button>
                        <Button variant="outline" onClick={() => router.push("/my-complaints")} className="h-auto py-4 justify-start">
                            <MessageSquare className="w-5 h-5 mr-3" />
                            <div className="text-left">
                                <p className="font-semibold">View My Complaints</p>
                                <p className="text-sm opacity-75">Track and manage your complaints</p>
                            </div>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Recent Complaints */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Recent Complaints</CardTitle>
                        <Link href="/my-complaints" className="text-sm text-blue-600 hover:underline">View all</Link>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : complaints.length === 0 ? (
                        <div className="text-center py-12">
                            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-600 mb-4">You haven't submitted any complaints yet.</p>
                            <Button onClick={() => router.push("/submit-complaint")}>Submit Your First Complaint</Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {complaints.slice(0, 5).map((complaint) => (
                                <div
                                    key={complaint._id}
                                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer"
                                    onClick={() => router.push(`/track/${complaint.trackingId}`)}
                                >
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-gray-900 truncate">{complaint.title}</h4>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(complaint.status)}`}>
                                                {complaint.status.replace("-", " ")}
                                            </span>
                                            <span className="text-sm text-gray-500">{formatRelativeTime(complaint.createdAt)}</span>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); router.push(`/chat/${complaint.trackingId}`); }}>
                                        <MessageSquare className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

// ----------------------------------------------------------------------
// ADMIN DASHBOARD COMPONENT
// ----------------------------------------------------------------------
function AdminDashboard({ user }: { user: any }) {
    const router = useRouter();
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchAllComplaints();
    }, []);

    const fetchAllComplaints = async () => {
        try {
            // Admin endpoint to fetch ALL complaints
            const response = await complaintAPI.getAllComplaints();
            if (response.data.success) {
                setComplaints(response.data.data.complaints);
            }
        } catch (error) {
            console.error("Failed to fetch admin complaints:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const stats = {
        total: complaints.length,
        pending: complaints.filter((c) => c.status === "pending").length,
        resolved: complaints.filter((c) => c.status === "resolved").length,
        urgent: complaints.filter((c) => c.priority === "urgent").length,
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
                <p className="text-gray-600">Overview of {user?.college} grievances</p>
            </div>

            {/* Admin Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Grievances</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
                            </div>
                            <div className="p-3 bg-indigo-100 rounded-lg">
                                <Building className="w-6 h-6 text-indigo-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Pending Action</p>
                                <p className="text-3xl font-bold text-red-600 mt-2">{stats.pending}</p>
                            </div>
                            <div className="p-3 bg-red-100 rounded-lg">
                                <AlertCircle className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Urgent Priority</p>
                                <p className="text-3xl font-bold text-orange-600 mt-2">{stats.urgent}</p>
                            </div>
                            <div className="p-3 bg-orange-100 rounded-lg">
                                <TrendingUp className="w-6 h-6 text-orange-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Resolved</p>
                                <p className="text-3xl font-bold text-green-600 mt-2">{stats.resolved}</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-lg">
                                <CheckCircle2 className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* All Complaints Table (Preview) */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Recent Grievances</CardTitle>
                        <Button variant="outline" size="sm" onClick={() => { }}>View All</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : complaints.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No complaints found for your college.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3">Tracking ID</th>
                                        <th className="px-4 py-3">Title</th>
                                        <th className="px-4 py-3">Category</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3">Priority</th>
                                        <th className="px-4 py-3">Date</th>
                                        <th className="px-4 py-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {complaints.slice(0, 10).map((complaint) => (
                                        <tr key={complaint._id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-4 py-3 font-medium text-gray-900">{complaint.trackingId}</td>
                                            <td className="px-4 py-3 truncate max-w-[200px]">{complaint.title}</td>
                                            <td className="px-4 py-3 capitalize">{complaint.category.replace("-", " ")}</td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(complaint.status)}`}>
                                                    {complaint.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 capitalize">
                                                <span className={complaint.priority === 'urgent' ? 'text-red-600 font-bold' : ''}>
                                                    {complaint.priority}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">{new Date(complaint.createdAt).toLocaleDateString()}</td>
                                            <td className="px-4 py-3">
                                                <Link href={`/track/${complaint.trackingId}`} className="font-medium text-blue-600 hover:underline">
                                                    Manage
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

// ----------------------------------------------------------------------
// MAIN LAYOUT SWITCHER
// ----------------------------------------------------------------------
export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // Authenticate logic
        const currentUser = getUser();
        if (!currentUser) {
            router.push("/login");
            return;
        }
        setUser(currentUser);
        setIsChecking(false);
    }, [router]);

    if (isChecking) {
        return null; // Or a loading spinner
    }

    // Role-based rendering
    if (isAdmin()) {
        return <AdminDashboard user={user} />;
    }

    return <StudentDashboard user={user} />;
}
