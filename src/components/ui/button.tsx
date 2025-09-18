import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        info:
          "bg-blue-100 text-blue-800 hover:bg-blue-200 active:bg-blue-300 dark:bg-blue-900 dark:text-blue-100 dark:hover:bg-blue-800 dark:active:bg-blue-700",
        danger:
          "bg-red-100 text-red-800 hover:bg-red-200 active:bg-red-300 dark:bg-red-900 dark:text-red-100 dark:hover:bg-red-800 dark:active:bg-red-700",
        warning:
          "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 active:bg-yellow-300 dark:bg-yellow-900 dark:text-yellow-100 dark:hover:bg-yellow-800 dark:active:bg-yellow-700",
        success:
          "bg-green-100 text-green-800 hover:bg-green-200 active:bg-green-300 dark:bg-green-900 dark:text-green-100 dark:hover:bg-green-800 dark:active:bg-green-700",
        neutral:
          "bg-gray-100 text-gray-800 hover:bg-gray-200 active:bg-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 dark:active:bg-gray-600",

        // Versions outline
        "outline-info":
          "border border-blue-300 text-blue-800 bg-white hover:bg-blue-50 active:bg-blue-100 dark:border-blue-700 dark:text-blue-200 dark:bg-transparent dark:hover:bg-blue-800/20 dark:active:bg-blue-800/30",
        "outline-danger":
          "border border-red-300 text-red-800 bg-white hover:bg-red-50 active:bg-red-100 dark:border-red-700 dark:text-red-200 dark:bg-transparent dark:hover:bg-red-800/20 dark:active:bg-red-800/30",
        "outline-warning":
          "border border-yellow-300 text-yellow-800 bg-white hover:bg-yellow-50 active:bg-yellow-100 dark:border-yellow-700 dark:text-yellow-200 dark:bg-transparent dark:hover:bg-yellow-800/20 dark:active:bg-yellow-800/30",
        "outline-success":
          "border border-green-300 text-green-800 bg-white hover:bg-green-50 active:bg-green-100 dark:border-green-700 dark:text-green-200 dark:bg-transparent dark:hover:bg-green-800/20 dark:active:bg-green-800/30",
        "outline-neutral":
          "border border-gray-300 text-gray-800 bg-white hover:bg-gray-50 active:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:active:bg-gray-600",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
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
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
