"use client";

import RoleGuard from "@/components/auth/RoleGuard";
import VerificationPending from "@/components/auth/VerificationPending";
import { LayoutDashboard, Users, FileText, Settings, LogOut, ShieldCheck } from "lucide-react";
import { logout, getUser, getOrganization } from "@/lib/auth";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isVerified] = useState(() => {
        // Initialize from storage to avoid effect update
        if (typeof window !== 'undefined') {
            const org = getOrganization();
            return !(org && org.isVerified === false);
        }
        return true;
    });
    const [isLoading, setIsLoading] = useState(true);
    // Move get calls inside effect to avoid dependency issues or hydration mismatches
    const user = getUser();

    useEffect(() => {
        setIsLoading(false); // eslint-disable-line react-hooks/set-state-in-effect
    }, []);

    if (isLoading) return null;

    // specialized check for client-side only
    if (!isVerified) {
        // We need to re-fetch org safely or pass it from state if we stored it
        const org = getOrganization();
        return <VerificationPending orgName={org?.name} />;
    }

    // Org Admin Navigation
    const navigation = [
        { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Complaints", href: "/admin/complaints", icon: FileText },
        { name: "Committee", href: "/admin/committee", icon: Users },
        { name: "Settings", href: "/admin/settings", icon: Settings },
    ];



    return (
        <RoleGuard allowedRoles={["admin"]}>
            <div className="min-h-screen bg-gray-50 flex">
                <aside className="w-64 bg-white border-r border-gray-200 fixed inset-y-0 z-30">
                    <div className="flex items-center h-16 px-6 border-b border-gray-100">
                        <ShieldCheck className="w-8 h-8 text-blue-600 mr-2" />
                        <span className="text-xl font-bold text-gray-900">VoiSafe</span>
                    </div>

                    <div className="px-6 py-4">
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                            {user?.college || "Organization"}
                        </div>
                        <div className="text-sm font-medium text-gray-900 truncate">
                            Admin Console
                        </div>
                    </div>

                    <nav className="px-4 space-y-1 mt-2">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors group"
                            >
                                <item.icon className="w-5 h-5 group-hover:text-blue-600 transition-colors" />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        ))}
                    </nav>

                    <div className="absolute bottom-0 w-full p-4 border-t border-gray-100">
                        <button
                            onClick={() => logout()}
                            className="flex items-center space-x-3 px-4 py-3 text-red-500 hover:bg-red-50 w-full rounded-lg transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Logout</span>
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
