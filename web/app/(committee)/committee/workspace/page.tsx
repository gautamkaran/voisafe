"use client";

import { CheckSquare } from "lucide-react";

export default function CommitteeWorkspacePage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">My Workspace</h1>

            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                    <h2 className="font-semibold text-slate-700 flex items-center">
                        <CheckSquare className="w-5 h-5 mr-2 text-indigo-600" />
                        Assigned to Me
                    </h2>
                    <span className="bg-indigo-100 text-indigo-700 text-xs px-2.5 py-0.5 rounded-full font-medium">
                        3 Active
                    </span>
                </div>

                <div className="divide-y divide-slate-100">
                    {/* Placeholder Items */}
                    {[1, 2, 3].map((item) => (
                        <div key={item} className="p-6 hover:bg-slate-50 transition-colors cursor-pointer group">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-medium text-slate-900 group-hover:text-indigo-600">Unable to access library wifi</h3>
                                    <p className="text-sm text-slate-500 mt-1">Infrastructure • Filed 2 days ago</p>
                                </div>
                                <span className="bg-amber-50 text-amber-700 text-xs px-2 py-1 rounded border border-amber-100">
                                    In Progress
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
