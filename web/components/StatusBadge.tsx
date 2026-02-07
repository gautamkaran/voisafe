import { Badge } from "@/components/ui/Badge"
import { CheckCircle2, Clock, AlertCircle, Zap } from "lucide-react"

interface StatusBadgeProps {
  status: string
  variant?: "default" | "compact"
}

const statusConfig: Record<string, { icon: typeof CheckCircle2; label: string; badgeVariant: "default" | "success" | "warning" | "info" | "destructive" | "outline" | "secondary" }> = {
  "pending": {
    icon: Clock,
    label: "Pending",
    badgeVariant: "warning",
  },
  "under-review": {
    icon: AlertCircle,
    label: "Under Review",
    badgeVariant: "info",
  },
  "resolved": {
    icon: CheckCircle2,
    label: "Resolved",
    badgeVariant: "success",
  },
  "closed": {
    icon: CheckCircle2,
    label: "Closed",
    badgeVariant: "success",
  },
  "rejected": {
    icon: AlertCircle,
    label: "Rejected",
    badgeVariant: "destructive",
  },
}

export function StatusBadge({ status, variant = "default" }: StatusBadgeProps) {
  const config = statusConfig[status] || {
    icon: Clock,
    label: status,
    badgeVariant: "default" as const,
  }

  const Icon = config.icon

  if (variant === "compact") {
    return (
      <Badge variant={config.badgeVariant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4" />
      <span className="text-sm font-medium">{config.label}</span>
    </div>
  )
}
