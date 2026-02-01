"use client";

import { useState } from "react";
import { Building2, CheckCircle, XCircle, MoreVertical, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { toast } from "sonner";

export default function SuperAdminOrganizationsPage() {
    // Mock Data
    const [organizations, setOrganizations] = useState([
        { id: 1, name: "St. Xavier's College", email: "admin@xaviers.edu", status: "Verified", date: "2024-03-10" },
        { id: 2, name: "City Engineering Institute", email: "principal@cityeng.edu", status: "Pending", date: "2024-03-12" },
        { id: 3, name: "Global Management School", email: "info@globalmgmt.edu", status: "Rejected", date: "2024-03-08" },
    ]);

    const handleApprove = (id: number) => {
        setOrganizations(orgs => orgs.map(org =>
            org.id === id ? { ...org, status: "Verified" } : org
        ));
        toast.success("Organization approved successfully");
    };

    const handleReject = (id: number) => {
        setOrganizations(orgs => orgs.map(org =>
            org.id === id ? { ...org, status: "Rejected" } : org
        ));
        toast.error("Organization application rejected");
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Organizations</h1>
                    <p className="text-slate-500">Manage registered institutions and approval requests</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                    </Button>
                    <Button>
                        <Building2 className="w-4 h-4 mr-2" />
                        Add Organization
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader className="border-b border-slate-100">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search organizations..."
                            className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 font-medium">
                            <tr>
                                <th className="px-6 py-4">Institution Name</th>
                                <th className="px-6 py-4">Contact Email</th>
                                <th className="px-6 py-4">Registration Date</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {organizations.map((org) => (
                                <tr key={org.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">{org.name}</td>
                                    <td className="px-6 py-4 text-slate-600">{org.email}</td>
                                    <td className="px-6 py-4 text-slate-500">{org.date}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                                            ${org.status === 'Verified' ? 'bg-green-50 text-green-700 border-green-200' :
                                                org.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                    'bg-red-50 text-red-700 border-red-200'}`}>
                                            {org.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {org.status === 'Pending' && (
                                            <div className="flex justify-end gap-2">
                                                <Button size="sm" variant="ghost" className="text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => handleApprove(org.id)}>
                                                    Approve
                                                </Button>
                                                <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleReject(org.id)}>
                                                    Reject
                                                </Button>
                                            </div>
                                        )}
                                        {org.status !== 'Pending' && (
                                            <Button size="sm" variant="ghost" className="text-slate-400">
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
}
