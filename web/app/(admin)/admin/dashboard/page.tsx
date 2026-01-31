"use client";

import { FileText, AlertTriangle, CheckCircle, Clock } from "lucide-react";

export default function AdminDashboardPage() {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Download Report
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Complaints" value="156" icon={FileText} color="blue" />
                <StatCard title="Pending" value="23" icon={Clock} color="amber" />
                <StatCard title="Urgent" value="5" icon={AlertTriangle} color="red" />
                <StatCard title="Resolved" value="128" icon={CheckCircle} color="green" />
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Complaints</h2>
                <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg dashed border border-gray-200">
                    Recent complaints list will appear here.
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color }: any) {
    const colors: any = {
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
