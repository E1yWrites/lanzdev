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
  primary: "bg-ink text-paper hover:bg-accent hover:text-on-sheet",
  secondary: "border border-ink/25 text-ink hover:border-ink/60 hover:bg-ink/[0.04]",
  ghost: "text-ink/70 hover:text-ink",
  accent: "bg-accent text-on-sheet hover:bg-ink",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5",
  md: "h-11 px-5",
  lg: "h-12 px-6",
};

/** Class list shared by <Button> and <ButtonLink> so links never wrap a <button>. */
export function buttonStyles({
  variant = "secondary",
  size = "md",
  className,
}: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}) {
  return cn(
    "tactile t-label inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md",
    "transition-colors duration-fast ease-standard",
    "disabled:pointer-events-none disabled:opacity-30",
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
