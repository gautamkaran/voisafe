"use client";

import { useState } from "react";
import { Save, Building, Bell, Lock, Globe } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { getOrganization } from "@/lib/auth";
import { toast } from "sonner";

export default function AdminSettingsPage() {
    const org = getOrganization();

    // Mock state
    const [settings, setSettings] = useState({
        name: org?.name || "My Organization",
        email: "admin@college.edu",
        notifications: true,
        anonymousMode: true,
    });

    const handleSave = () => {
        toast.success("Settings saved successfully!");
    };

    return (
        <div className="max-w-4xl space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Building className="w-5 h-5" />
                        Organization Profile
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Institution Name</label>
                            <input
                                type="text"
                                value={settings.name}
                                onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Contact Email</label>
                            <input
                                type="email"
                                value={settings.email}
                                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Lock className="w-5 h-5" />
                        Privacy & Security
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                        <div>
                            <h4 className="font-medium text-gray-900">Strict Anonymity Mode</h4>
                            <p className="text-sm text-gray-500">Hide student metadata even from internal logs</p>
                        </div>
                        <div className="relative inline-block w-12 h-6 transition-colors duration-200 ease-in-out border-2 border-transparent rounded-full cursor-pointer bg-green-500">
                            <span className="inline-block w-5 h-5 translate-x-6 transform bg-white rounded-full shadow ring-0 transition duration-200 ease-in-out pointer-events-none" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button size="lg" onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                </Button>
            </div>
        </div>
    );
}
