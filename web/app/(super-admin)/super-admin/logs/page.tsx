"use client";

import { ScrollText, AlertTriangle, Info, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function SuperAdminLogsPage() {
    const logs = [
        { id: 1, type: "info", message: "New organization registration: City Engineering Institute", time: "2 mins ago" },
        { id: 2, type: "error", message: "Failed login attempt detected from IP 192.168.1.105", time: "15 mins ago" },
        { id: 3, type: "success", message: "Database backup completed successfully", time: "1 hour ago" },
        { id: 4, type: "warning", message: "High server load detected (85% CPU)", time: "3 hours ago" },
        { id: 5, type: "info", message: "System maintenance scheduled for 2024-04-01", time: "5 hours ago" },
    ];

    const getIcon = (type: string) => {
        switch (type) {
            case "error": return <AlertTriangle className="w-5 h-5 text-red-500" />;
            case "warning": return <AlertTriangle className="w-5 h-5 text-amber-500" />;
            case "success": return <CheckCircle className="w-5 h-5 text-green-500" />;
            default: return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">System Logs</h1>
                <p className="text-slate-500">Audit trail and system activity monitoring</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ScrollText className="w-5 h-5" />
                        Recent Activity
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {logs.map((log) => (
                            <div key={log.id} className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100">
                                <div className="mt-1">{getIcon(log.type)}</div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-slate-900">{log.message}</p>
                                    <div className="flex items-center mt-1 text-xs text-slate-500">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {log.time}
                                    </div>
                                </div>
                                <span className={`text-xs font-mono px-2 py-1 rounded bg-white border border-slate-200 uppercase ${log.type === 'error' ? 'text-red-600' :
                                        log.type === 'warning' ? 'text-amber-600' :
                                            log.type === 'success' ? 'text-green-600' : 'text-blue-600'
                                    }`}>
                                    {log.type}
                                </span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
