"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Mail, Shield } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { toast } from "sonner";

export default function AdminCommitteePage() {
    const router = useRouter();
    // Placeholder state - normally fetched from API
    const [members] = useState([
        { id: 1, name: "Dr. Anjali Sharma", role: "Chairperson", email: "anjali.s@college.edu", status: "Active" },
        { id: 2, name: "Prof. Rajesh Kumar", role: "Member", email: "rajesh.k@college.edu", status: "Active" },
        { id: 3, name: "Mrs. Sunita Verma", role: "Counselor", email: "sunita.v@college.edu", status: "On Leave" },
    ]);



    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Committee Management</h1>
                    <p className="text-gray-600">Manage members of your Internal Complaints Committee (ICC)</p>
                </div>
                <Button onClick={() => router.push("/admin/committee/add")}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Member
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {members.map((member) => (
                    <Card key={member.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="pt-6">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                                        {member.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{member.name}</h3>
                                        <p className="text-sm text-blue-600 font-medium">{member.role}</p>
                                    </div>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${member.status === "Active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                                    }`}>
                                    {member.status}
                                </span>
                            </div>

                            <div className="mt-6 space-y-3">
                                <div className="flex items-center text-sm text-gray-500">
                                    <Mail className="w-4 h-4 mr-2" />
                                    {member.email}
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                    <Shield className="w-4 h-4 mr-2" />
                                    Committee Access
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end gap-2">
                                <Button variant="ghost" size="sm" className="text-gray-500" onClick={() => router.push(`/admin/committee/${member.id}`)}>Edit</Button>
                                <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50" onClick={() => toast.success("Access revoked (Demo)")}>Remove</Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
