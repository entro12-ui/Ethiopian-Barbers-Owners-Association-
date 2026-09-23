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
          "inline-flex items-center justify-center font-semibold transition-all duration-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold/60 focus:ring-offset-2 focus:ring-offset-off-white disabled:opacity-50 disabled:cursor-not-allowed",
          {
            "bg-gradient-to-r from-gold-light via-gold to-[#ff7a00] text-charcoal shadow-[0_8px_28px_rgba(255,159,28,0.4)] hover:shadow-[0_14px_40px_rgba(255,183,3,0.55)] hover:brightness-110 hover:-translate-y-1":
              variant === "primary",
            "bg-white/20 border-2 border-white text-white backdrop-blur-sm hover:bg-white hover:text-charcoal":
              variant === "secondary",
            "bg-transparent border-2 border-gold text-charcoal hover:bg-gold hover:text-charcoal hover:shadow-lg hover:shadow-gold/30":
              variant === "outline",
            "bg-transparent text-white hover:text-gold-light": variant === "ghost",
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
