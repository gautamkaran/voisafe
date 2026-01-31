"use client";

import RoleGuard from "@/components/auth/RoleGuard";
import { LayoutDashboard, MessageSquare, CheckSquare, LogOut } from "lucide-react";
import { logout } from "@/lib/auth";
import Link from "next/link";

export default function CommitteeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Committee Navigation
    const navigation = [
        { name: "My Workspace", href: "/committee/workspace", icon: CheckSquare },
        { name: "All Complaints", href: "/committee/complaints", icon: LayoutDashboard },
        { name: "Messages", href: "/committee/chat", icon: MessageSquare },
    ];

    return (
        <RoleGuard allowedRoles={["committee-admin"]}>
            <div className="min-h-screen bg-slate-50 flex">
                <aside className="w-64 bg-white border-r border-slate-200 fixed inset-y-0 z-30 shadow-sm">
                    <div className="flex items-center h-16 px-6 bg-slate-100 border-b border-slate-200">
                        <span className="text-lg font-bold text-slate-700">Committee Panel</span>
                    </div>

                    <nav className="px-4 space-y-1 mt-6">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="flex items-center space-x-3 px-4 py-3 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        ))}
                    </nav>

                    <div className="absolute bottom-0 w-full p-4 border-t border-slate-200">
                        <button
                            onClick={() => logout()}
                            className="flex items-center space-x-3 px-4 py-3 text-slate-500 hover:text-red-600 w-full transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Sign Out</span>
                        </button>
                    </div>
                </aside>

                <main className="flex-1 ml-64 p-8">
                    {children}
                </main>
            </div>
        </RoleGuard>
    );
}
