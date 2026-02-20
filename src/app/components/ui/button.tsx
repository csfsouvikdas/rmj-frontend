"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, HTMLMotionProps } from "framer-motion";

import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-bold uppercase tracking-tight transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none active:scale-95 focus-visible:ring-2 focus-visible:ring-amber-500/50",
  {
    variants: {
      variant: {
        // High-end dark theme for Radha Madhav
        default: "bg-slate-900 text-white shadow-lg shadow-slate-200 hover:bg-slate-800 hover:shadow-xl hover:-translate-y-0.5",
        // Gold accented primary
        primary: "bg-amber-500 text-white shadow-lg shadow-amber-200 hover:bg-amber-600 hover:shadow-amber-300/50 hover:-translate-y-0.5",
        destructive:
          "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-100",
        outline:
          "border-2 border-slate-200 bg-transparent text-slate-900 hover:border-amber-500 hover:text-amber-600 hover:bg-amber-50/50",
        secondary:
          "bg-slate-100 text-slate-900 hover:bg-slate-200",
        ghost:
          "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
        link: "text-amber-600 underline-offset-4 hover:underline font-black",
      },
      size: {
        default: "h-12 px-6 py-2",
        sm: "h-9 rounded-lg gap-1.5 px-4 text-xs",
        lg: "h-14 rounded-2xl px-8 text-base tracking-widest",
        icon: "size-11 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

// We merge React Button attributes with Framer Motion props for the animation
export interface ButtonProps
  extends Omit<HTMLMotionProps<"button">, "ref">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    // If asChild is true, we use Slot (standard Radix behavior)
    // If false, we use motion.button for the click animation
    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref as any}
          {...props}
        />
      );
    }

    return (
      <motion.button
        whileTap={{ scale: 0.96 }}
        whileHover={{ y: -1 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        ref={ref as any}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };