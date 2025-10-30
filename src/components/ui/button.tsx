import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",

        
        info:
          "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 active:from-blue-800 active:to-indigo-800 transition-all duration-200 dark:from-blue-700 dark:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600 dark:active:from-blue-500 dark:active:to-indigo-500 shadow-md hover:shadow-lg rounded-lg",

        danger:
          "bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600 active:from-red-800 active:to-red-700 transition-all duration-200 dark:from-red-700 dark:to-red-600 dark:hover:from-red-600 dark:hover:to-red-500 dark:active:from-red-500 dark:active:to-red-400 shadow-md hover:shadow-lg rounded-lg",

        warning:
          "bg-gradient-to-r from-yellow-500 to-yellow-400 text-white hover:from-yellow-600 hover:to-yellow-500 active:from-yellow-700 active:to-yellow-600 transition-all duration-200 dark:from-yellow-600 dark:to-yellow-500 dark:hover:from-yellow-500 dark:hover:to-yellow-400 dark:active:from-yellow-400 dark:active:to-yellow-300 shadow-md hover:shadow-lg rounded-lg",

        success:
          "bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-700 hover:to-green-600 active:from-green-800 active:to-green-700 transition-all duration-200 dark:from-green-700 dark:to-green-600 dark:hover:from-green-600 dark:hover:to-green-500 dark:active:from-green-500 dark:active:to-green-400 shadow-md hover:shadow-lg rounded-lg",

        neutral:
          "bg-gradient-to-r from-gray-600 to-gray-500 text-white hover:from-gray-700 hover:to-gray-600 active:from-gray-800 active:to-gray-700 transition-all duration-200 dark:from-gray-700 dark:to-gray-600 dark:hover:from-gray-600 dark:hover:to-gray-500 dark:active:from-gray-500 dark:active:to-gray-400 shadow-md hover:shadow-lg rounded-lg",


        "outline-info":
          "border border-blue-600 text-blue-600 bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 active:from-blue-100 active:to-blue-200 transition-all duration-200 dark:border-blue-500 dark:text-blue-400 dark:bg-transparent dark:hover:bg-gradient-to-r dark:hover:from-blue-900/20 dark:hover:to-blue-800/20 dark:active:from-blue-900/30 dark:active:to-blue-800/30 shadow-sm hover:shadow-md rounded-lg",

        "outline-danger":
          "border border-red-600 text-red-600 bg-white hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 active:from-red-100 active:to-red-200 transition-all duration-200 dark:border-red-500 dark:text-red-400 dark:bg-transparent dark:hover:bg-gradient-to-r dark:hover:from-red-900/20 dark:hover:to-red-800/20 dark:active:from-red-900/30 dark:active:to-red-800/30 shadow-sm hover:shadow-md rounded-lg",

        "outline-warning":
          "border border-yellow-500 text-yellow-600 bg-white hover:bg-gradient-to-r hover:from-yellow-50 hover:to-yellow-100 active:from-yellow-100 active:to-yellow-200 transition-all duration-200 dark:border-yellow-500 dark:text-yellow-400 dark:bg-transparent dark:hover:bg-gradient-to-r dark:hover:from-yellow-900/20 dark:hover:to-yellow-800/20 dark:active:from-yellow-900/30 dark:active:to-yellow-800/30 shadow-sm hover:shadow-md rounded-lg",

        "outline-success":
          "border border-green-600 text-green-600 bg-white hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 active:from-green-100 active:to-green-200 transition-all duration-200 dark:border-green-500 dark:text-green-400 dark:bg-transparent dark:hover:bg-gradient-to-r dark:hover:from-green-900/20 dark:hover:to-green-800/20 dark:active:from-green-900/30 dark:active:to-green-800/30 shadow-sm hover:shadow-md rounded-lg",

        "outline-neutral":
          "border border-gray-600 text-gray-800 bg-white hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 active:from-gray-100 active:to-gray-200 transition-all duration-200 dark:border-gray-500 dark:text-gray-400 dark:bg-transparent dark:hover:bg-gradient-to-r dark:hover:from-gray-900/20 dark:hover:to-gray-800/20 dark:active:from-gray-900/30 dark:active:to-gray-800/30 shadow-sm hover:shadow-md rounded-lg",

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
