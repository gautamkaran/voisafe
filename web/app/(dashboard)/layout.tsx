"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import RoleGuard from "@/components/auth/RoleGuard";
import Link from "next/link";
import {
    LayoutDashboard,
    FileText,
    MessageSquare,
    List,
    LogOut,
    Menu,
    X
} from "lucide-react";

import { getUser, logout } from "@/lib/auth";
import { User } from "@/types";
import { Button } from "@/components/ui/Button";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<User | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const currentUser = getUser();
        setUser(currentUser);
    }, [router]);

    const navigation = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Submit Complaint", href: "/submit-complaint", icon: FileText },
        { name: "My Complaints", href: "/my-complaints", icon: List },
    ];

    const handleLogout = () => {
        logout();
    };

    return (
        <RoleGuard allowedRoles={['student']}>
            <div className="min-h-screen bg-gray-50">
                {/* ... rest of the layout ... */}

                {/* Mobile sidebar backdrop */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <aside
                    className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                        }`}
                >
                    <div className="flex flex-col h-full">
                        {/* Logo */}
                        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
                            <h1 className="text-xl font-bold text-blue-600">VoiSafe</h1>
                            <button
                                onClick={() => setIsSidebarOpen(false)}
                                className="lg:hidden"
                            >
                                <X className="w-6 h-6 text-gray-900" />
                            </button>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 px-4 py-6 space-y-2">
                            {navigation.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                            ? "bg-blue-50 text-blue-600 font-medium"
                                            : "text-gray-700 hover:bg-gray-50"
                                            }`}
                                        onClick={() => setIsSidebarOpen(false)}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* User section */}
                        <div className="p-4 border-t border-gray-200">
                            {user && (
                                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg mb-2">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                        <span className="text-blue-600 font-semibold">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {user.name}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                    </div>
                                </div>
                            )}
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={handleLogout}
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </Button>
                        </div>
                    </div>
                </aside>

                {/* Main content */}
                <div className="lg:pl-64">
                    {/* Mobile header */}
                    <header className="sticky top-0 z-30 flex items-center h-16 px-4 bg-white border-b border-gray-200 lg:hidden">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 -ml-2 rounded-lg hover:bg-gray-100"
                        >
                            <Menu className="w-6 h-6 text-gray-900" />
                        </button>
                        <h1 className="ml-4 text-lg font-semibold text-gray-900">VoiSafe</h1>
                    </header>

                    {/* Page content */}
                    <main className="p-6 lg:p-8">{children}</main>
                </div>
            </div>
        </RoleGuard>
    );
}
