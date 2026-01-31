"use client";

import { ShieldAlert, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface VerificationPendingProps {
    orgName?: string;
}

export default function VerificationPending({ orgName }: VerificationPendingProps) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-amber-50 p-6 flex justify-center border-b border-amber-100">
                    <div className="p-4 bg-amber-100 rounded-full">
                        <ShieldAlert className="w-12 h-12 text-amber-600" />
                    </div>
                </div>

                <div className="p-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification in Progress</h2>
                    <p className="text-gray-600 mb-6">
                        Access to <span className="font-semibold text-gray-900">{orgName || "your organization"}</span> is currently pending approval from the VoiSafe administration.
                    </p>

                    <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left text-sm text-gray-600 border border-gray-200">
                        <p className="font-semibold text-gray-800 mb-1">What this means:</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>You cannot access the admin dashboard yet.</li>
                            <li>Students cannot submit complaints.</li>
                            <li>Our team is reviewing your institution's details.</li>
                        </ul>
                    </div>

                    <Button
                        className="w-full"
                        onClick={() => window.location.href = "mailto:support@voisafe.com"}
                    >
                        <Mail className="w-4 h-4 mr-2" />
                        Contact Support
                    </Button>

                    <button
                        onClick={() => {
                            localStorage.clear();
                            window.location.href = '/login';
                        }}
                        className="mt-4 text-sm text-gray-500 hover:text-gray-700 underline"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
}
