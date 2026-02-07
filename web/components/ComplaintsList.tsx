"use client"

import { useState } from "react"
import { FileText, MessageSquare, CheckCircle2, AlertCircle } from "lucide-react"
import { Complaint } from "@/types"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { StatusBadge } from "@/components/StatusBadge"
import { formatRelativeTime } from "@/lib/utils"
import Link from "next/link"

interface ComplaintCardProps {
  complaint: Complaint
  onMessageClick?: (complaint: Complaint) => void
  onViewClick?: (complaint: Complaint) => void
}

export function ComplaintCard({
  complaint,
  onMessageClick,
  onViewClick,
}: ComplaintCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow overflow-hidden">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-4 h-4 text-gray-400" />
                <h3 className="font-semibold text-gray-900 truncate">{complaint.title}</h3>
              </div>
              <p className="text-sm text-gray-500">
                Tracking ID: <span className="font-mono font-medium text-gray-700">{complaint.trackingId}</span>
              </p>
            </div>
            <StatusBadge status={complaint.status} variant="compact" />
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2">{complaint.description}</p>

          {/* Meta Info */}
          <div className="flex items-center gap-4 pt-2 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              <span className="font-medium text-gray-700">{complaint.category}</span>
            </div>
            <div className="text-xs text-gray-500 ml-auto">
              {formatRelativeTime(complaint.createdAt)}
            </div>
          </div>

          {/* Actions */}
          {(onMessageClick || onViewClick) && (
            <div className="flex gap-2 pt-2">
              {onViewClick && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => onViewClick(complaint)}
                >
                  View Details
                </Button>
              )}
              {onMessageClick && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => onMessageClick(complaint)}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Message
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface ComplaintsListProps {
  complaints: Complaint[]
  onViewClick?: (complaint: Complaint) => void
  onMessageClick?: (complaint: Complaint) => void
  emptyState?: React.ReactNode
}

export function ComplaintsList({
  complaints,
  onViewClick,
  onMessageClick,
  emptyState,
}: ComplaintsListProps) {
  if (complaints.length === 0) {
    return (
      emptyState || (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No complaints found</p>
          </CardContent>
        </Card>
      )
    )
  }

  return (
    <div className="space-y-4">
      {complaints.map((complaint) => (
        <ComplaintCard
          key={complaint._id}
          complaint={complaint}
          onViewClick={onViewClick}
          onMessageClick={onMessageClick}
        />
      ))}
    </div>
  )
}
