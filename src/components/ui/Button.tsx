import { cn } from "@/lib/utils";
import { forwardRef, type ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "accent";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-swiss-fg text-swiss-bg border-2 border-swiss-border hover:bg-swiss-accent hover:border-swiss-accent transition-all duration-150",
  secondary:
    "bg-swiss-bg text-swiss-fg border-2 border-swiss-border hover:bg-swiss-fg hover:text-swiss-bg transition-all duration-150",
  ghost:
    "bg-transparent text-swiss-fg border-2 border-transparent hover:border-swiss-border transition-all duration-150",
  accent:
    "bg-swiss-accent text-swiss-bg border-2 border-swiss-accent hover:bg-swiss-fg hover:border-swiss-fg transition-all duration-150",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-10 px-4 text-xs",
  md: "h-12 px-6 text-sm",
  lg: "h-16 px-8 text-sm",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "secondary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2",
          "font-swiss font-bold tracking-widest uppercase",
          "transition-all duration-150 ease-out",
          "disabled:opacity-30 disabled:pointer-events-none",
          variantStyles[variant],
          sizeStyles[size],
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

export { Button, type ButtonProps, type ButtonVariant };
