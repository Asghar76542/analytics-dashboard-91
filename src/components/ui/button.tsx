import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-dashboard-accent1 text-white hover:bg-dashboard-accent1/90", // Primary Purple
        destructive: "bg-[#ea384c] text-white hover:bg-[#ea384c]/90", // Red
        outline: "border border-dashboard-cardBorder bg-transparent hover:bg-dashboard-card hover:text-white",
        secondary: "bg-dashboard-accent2 text-white hover:bg-dashboard-accent2/80", // Secondary Purple
        ghost: "hover:bg-dashboard-card hover:text-white",
        link: "text-dashboard-accent1 underline-offset-4 hover:underline", // Primary Purple
        success: "bg-dashboard-accent3 text-white hover:bg-dashboard-accent3/80", // Success Green
        info: "bg-[#0EA5E9] text-white hover:bg-[#0EA5E9]/80", // Ocean Blue
        warning: "bg-dashboard-warning text-black hover:bg-dashboard-warning/80",
        soft: "bg-dashboard-softBlue text-dashboard-accent1 hover:bg-dashboard-softBlue/80",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }