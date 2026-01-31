"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser, isAuthenticated } from "@/lib/auth";
import { User } from "@/types";

interface RoleGuardProps {
    children: React.ReactNode;
    allowedRoles: string[];
}

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        // 1. Check Authentication
        if (!isAuthenticated()) {
            router.push("/login");
            return;
        }

        // 2. Check Role
        const user = getUser();
        if (user && allowedRoles.includes(user.role)) {
            setIsAuthorized(true);
        } else {
            // Redirect to appropriate dashboard based on actual role
            if (user?.role === 'admin') router.push('/admin/dashboard');
            else if (user?.role === 'super-admin') router.push('/super-admin');
            else if (user?.role === 'committee-admin') router.push('/committee/workspace');
            else router.push('/dashboard'); // Student
        }
    }, [router, allowedRoles]);

    if (!isAuthorized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p className="mt-4 text-gray-500">Verifying access...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
