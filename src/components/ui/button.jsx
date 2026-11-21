import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva } from "class-variance-authority";
import { cn } from "cn"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-full border border-transparent font-semibold whitespace-nowrap transition-all duration-200 outline-none select-none hover:-translate-y-0.5 focus-visible:border-foreground focus-visible:ring-4 focus-visible:ring-ring/45 active:translate-y-0 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-danger aria-invalid:ring-4 aria-invalid:ring-danger/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        brand:
          "bg-brand text-brand-foreground shadow-[inset_0_-3px_0_rgba(17,17,17,0.18)] hover:bg-brand-strong",
        outline:
          "border-input bg-card text-foreground hover:bg-muted dark:hover:bg-input/50",
        ghost: "text-foreground hover:bg-muted dark:hover:bg-muted",
        success:
          "bg-success-bg text-success hover:bg-success-bg/70 dark:hover:bg-success-bg",
        destructive:
          "bg-danger-bg text-danger hover:bg-danger-bg/70 dark:hover:bg-danger-bg",
      },
      size: {
        default: "h-11 gap-2 px-6 text-[15px]",
        sm: "h-9 gap-1.5 px-4 text-sm",
        lg: "h-12 gap-2 px-7 text-base",
        icon: "size-11",
        "icon-sm": "size-9 [&_svg:not([class*='size-'])]:size-4",
        "icon-lg": "size-12 [&_svg:not([class*='size-'])]:size-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
