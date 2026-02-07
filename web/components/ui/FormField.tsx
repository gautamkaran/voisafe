import * as React from "react"
import { cn } from "@/lib/utils"

interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string
  error?: string
  required?: boolean
  hint?: string
}

const FormField = React.forwardRef<
  HTMLDivElement,
  FormFieldProps
>(({ className, label, error, required, hint, children, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-2", className)} {...props}>
    {label && (
      <label className="block text-sm font-medium text-gray-900">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    )}
    {children}
    {error && (
      <p className="text-sm text-red-600 flex items-center gap-1">
        <span className="inline-block w-1 h-1 bg-red-600 rounded-full" />
        {error}
      </p>
    )}
    {hint && !error && (
      <p className="text-sm text-gray-500">{hint}</p>
    )}
  </div>
))
FormField.displayName = "FormField"

export { FormField }
