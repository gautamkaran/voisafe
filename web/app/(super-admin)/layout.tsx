"use client";

import RoleGuard from "@/components/auth/RoleGuard";
import { LayoutDashboard, Building2, Users, Settings, LogOut } from "lucide-react";
import { logout } from "@/lib/auth";

export default function SuperAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const navigation = [
        { name: "Platform Overview", href: "/super-admin", icon: LayoutDashboard },
        { name: "Organizations", href: "/super-admin/organizations", icon: Building2 },
        { name: "System Logs", href: "/super-admin/logs", icon: Settings },
    ];

    return (
        <RoleGuard allowedRoles={["super-admin"]}>
            <div className="min-h-screen bg-gray-100 flex">
                {/* Sidebar would go here - simplified for this file */}
                <aside className="w-64 bg-slate-900 text-white fixed inset-y-0">
                    <div className="p-6">
                        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                            Admin Console
                        </h1>
                        <p className="text-xs text-slate-400 mt-1">Super Admin Access</p>
                    </div>

                    <nav className="px-4 space-y-2 mt-4">
                        {navigation.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className="flex items-center space-x-3 px-4 py-3 text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
                            >
                                <item.icon className="w-5 h-5" />
                                <span>{item.name}</span>
                            </a>
                        ))}

                        <button
                            onClick={() => logout()}
                            className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-slate-800 rounded-lg transition-colors mt-8"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Logout</span>
                        </button>
                    </nav>
                </aside>

                <main className="flex-1 ml-64 p-8">
                    {children}
                </main>
            </div>
        </RoleGuard>
    );
}
