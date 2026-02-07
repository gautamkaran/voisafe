"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    FileText,
    AlertTriangle,
    CheckCircle,
    Clock
} from "lucide-react";
import { toast } from "sonner";

import { complaintAPI } from "@/lib/api";
import { Complaint } from "@/types";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { getStatusColor } from "@/lib/utils";
import { getUser } from "@/lib/auth";

export default function AdminDashboardPage() {
    const router = useRouter();
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any

    useEffect(() => {
        const currentUser = getUser();
        setUser(currentUser);
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
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600">Overview of {user?.college} grievances</p>
                </div>


                <button
                    onClick={() => toast.info("Report download feature coming soon!")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Download Report
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Complaints" value={stats.total.toString()} icon={FileText} color="blue" />
                <StatCard title="Pending" value={stats.pending.toString()} icon={Clock} color="amber" />
                <StatCard title="Urgent" value={stats.urgent.toString()} icon={AlertTriangle} color="red" />
                <StatCard title="Resolved" value={stats.resolved.toString()} icon={CheckCircle} color="green" />
            </div>

            {/* Recent Complaints Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Recent Grievances</CardTitle>
                        <Button variant="outline" size="sm" onClick={() => router.push('/admin/complaints')}>View All</Button>
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
                                                <Link href={`/admin/complaints/${complaint._id}`} className="font-medium text-blue-600 hover:underline">
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

function StatCard({ title, value, icon: Icon, color }: { title: string; value: string; icon: any; color: string }) { // eslint-disable-line @typescript-eslint/no-explicit-any
    const colors: Record<string, string> = {
        blue: "bg-blue-50 text-blue-600",
        amber: "bg-amber-50 text-amber-600",
        red: "bg-red-50 text-red-600",
        green: "bg-green-50 text-green-600",
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
            <div className={`p-3 rounded-full ${colors[color]}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
        </div>
    )
}
