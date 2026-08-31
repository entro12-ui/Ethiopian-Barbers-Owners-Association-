"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-semibold transition-all duration-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:ring-offset-2 focus:ring-offset-charcoal disabled:opacity-50 disabled:cursor-not-allowed",
          {
            "bg-gold text-charcoal hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20":
              variant === "primary",
            "bg-transparent border-2 border-white text-white hover:bg-white hover:text-charcoal":
              variant === "secondary",
            "bg-transparent border-2 border-gold text-gold hover:bg-gold hover:text-charcoal":
              variant === "outline",
            "bg-transparent text-white hover:text-gold": variant === "ghost",
          },
          {
            "px-4 py-2 text-sm": size === "sm",
            "px-6 py-3 text-base": size === "md",
            "px-8 py-4 text-lg": size === "lg",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
