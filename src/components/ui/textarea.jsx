import * as React from "react"
import { cn } from "cn"

function Textarea({
  className,
  ...props
}) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-[15px] transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-foreground focus-visible:ring-4 focus-visible:ring-ring/45 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger aria-invalid:ring-4 aria-invalid:ring-danger/20",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
