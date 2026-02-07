import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border border-transparent bg-red-100 text-red-800",
        outline: "border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
        success: "border border-transparent bg-green-100 text-green-800",
        warning: "border border-transparent bg-yellow-100 text-yellow-800",
        info: "border border-transparent bg-blue-100 text-blue-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
