import Link from "next/link";
import { cn } from "@/lib/utils";
import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "accent";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-swiss-fg text-swiss-bg border-2 border-swiss-border hover:bg-swiss-accent hover:border-swiss-accent hover:shadow-[0_10px_24px_-10px_rgba(0,0,0,0.35)]",
  secondary:
    "bg-swiss-bg text-swiss-fg border-2 border-swiss-border hover:bg-swiss-fg hover:text-swiss-bg hover:shadow-[0_10px_24px_-10px_rgba(0,0,0,0.25)]",
  ghost:
    "bg-transparent text-swiss-fg border-2 border-transparent hover:border-swiss-border",
  accent:
    "bg-swiss-accent text-swiss-bg border-2 border-swiss-accent hover:bg-swiss-fg hover:border-swiss-fg hover:shadow-[0_10px_24px_-10px_rgba(255,48,0,0.4)]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-10 px-4 text-xs",
  md: "h-12 px-6 text-sm",
  lg: "h-16 px-8 text-sm",
};

/** Class list shared by <Button> and <ButtonLink> so links never wrap a <button>. */
export function buttonStyles({
  variant = "secondary",
  size = "md",
  className,
}: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}) {
  return cn(
    "tactile inline-flex items-center justify-center gap-2",
    "font-swiss font-bold tracking-widest uppercase",
    "transition-all duration-fast ease-standard",
    "disabled:opacity-30 disabled:pointer-events-none",
    variantStyles[variant],
    sizeStyles[size],
    className
  );
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "secondary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={buttonStyles({ variant, size, className })}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Opens in a new tab with rel="noopener noreferrer". */
  external?: boolean;
}

/** A link styled as a button — one focus stop, valid HTML. */
function ButtonLink({ href, variant = "secondary", size = "md", external, className, children, ...props }: ButtonLinkProps) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={buttonStyles({ variant, size, className })}
      {...props}
    >
      {children}
    </Link>
  );
}

export { Button, ButtonLink, type ButtonProps, type ButtonVariant };
