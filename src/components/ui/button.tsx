import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
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

        // ==== Nouvelles variantes (uniquement les couleurs) ====
        info: "bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700 dark:focus:ring-blue-900",
        danger: "bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-100 dark:bg-red-600 dark:text-white dark:hover:bg-red-700 dark:focus:ring-red-900",
        warning: "bg-yellow-400 text-black hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-100 dark:bg-yellow-500 dark:text-black dark:hover:bg-yellow-600 dark:focus:ring-yellow-900",
        success: "bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-100 dark:bg-green-600 dark:text-white dark:hover:bg-green-700 dark:focus:ring-green-900",
        neutral: "text-white bg-[#2A4365] hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200 dark:bg-[#2A4365] dark:text-white dark:hover:bg-[#1A365D] dark:focus:ring-blue-800 transition-colors duration-150",

        "outline-info": "border border-blue-500 text-blue-500 hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-100 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/30 dark:focus:ring-blue-900",
        "outline-danger": "border border-red-500 text-red-500 hover:bg-red-50 focus:outline-none focus:ring-4 focus:ring-red-100 dark:border-red-400 dark:text-red-400 dark:hover:bg-red-900/20 dark:focus:ring-red-800",
        "outline-warning": "border border-yellow-500 text-yellow-600 hover:bg-yellow-50 focus:outline-none focus:ring-4 focus:ring-yellow-100 dark:border-yellow-400 dark:text-yellow-300 dark:hover:bg-yellow-900/30 dark:focus:ring-yellow-900",
        "outline-success": "border border-green-500 text-green-500 hover:bg-green-50 focus:outline-none focus:ring-4 focus:ring-green-100 dark:border-green-400 dark:text-green-400 dark:hover:bg-green-900/30 dark:focus:ring-green-900",
        "outline-neutral": "text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700",
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
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
