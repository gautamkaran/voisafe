import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from "lucide-react"
import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3.5 text-sm flex gap-3 items-start",
  {
    variants: {
      variant: {
        default: "bg-blue-50 border-blue-200 text-blue-900",
        destructive: "bg-red-50 border-red-200 text-red-900",
        success: "bg-green-50 border-green-200 text-green-900",
        warning: "bg-yellow-50 border-yellow-200 text-yellow-900",
        info: "bg-blue-50 border-blue-200 text-blue-900",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  icon?: boolean
  onClose?: () => void
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, icon = true, onClose, children, ...props }, ref) => {
    const iconMap = {
      default: Info,
      destructive: AlertCircle,
      success: CheckCircle2,
      warning: AlertTriangle,
      info: Info,
    }

    const Icon = iconMap[variant || "default"]

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        {icon && <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />}
        <div className="flex-1">{children}</div>
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 rounded hover:opacity-75"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    )
  }
)

Alert.displayName = "Alert"

export { Alert, alertVariants }
