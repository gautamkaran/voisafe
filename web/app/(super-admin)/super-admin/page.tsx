"use client";

import { Building2, Users, AlertCircle } from "lucide-react";

export default function SuperAdminPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">Platform Overview</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Total Organizations</p>
                            <p className="text-3xl font-bold text-slate-900 mt-2">12</p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                            <Building2 className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Pending Requests</p>
                            <p className="text-3xl font-bold text-amber-600 mt-2">4</p>
                        </div>
                        <div className="p-3 bg-amber-100 rounded-full text-amber-600">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Total Users</p>
                            <p className="text-3xl font-bold text-slate-900 mt-2">1,245</p>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-full text-purple-600">
                            <Users className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Registrations Table Placeholder */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200">
                    <h2 className="font-semibold text-slate-800">Recent Organization Requests</h2>
                </div>
                <div className="p-6 text-center text-slate-500">
                    <p>Feature coming soon...</p>
                </div>
            </div>
        </div>
    );
}
