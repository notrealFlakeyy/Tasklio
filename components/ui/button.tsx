import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 overflow-hidden rounded-[18px] border text-sm font-semibold tracking-[0.01em] transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "border-[color:rgba(68,55,48,0.14)] bg-[var(--color-brand-strong)] px-5 py-2.5 text-white shadow-[0_18px_40px_rgba(68,55,48,0.18)] hover:-translate-y-0.5 hover:bg-[var(--color-brand)]",
        secondary:
          "border-[color:var(--color-border)] bg-white/82 px-5 py-2.5 text-[var(--color-ink)] shadow-[0_12px_30px_rgba(68,55,48,0.07)] hover:-translate-y-0.5 hover:border-[color:var(--color-border-strong)] hover:bg-white",
        ghost:
          "border-transparent px-4 py-2.5 text-[var(--color-muted)] hover:bg-white/70 hover:text-[var(--color-ink)]",
        danger:
          "border-[color:rgba(143,74,69,0.12)] bg-[var(--color-danger)] px-5 py-2.5 text-white shadow-[0_16px_35px_rgba(143,74,69,0.16)] hover:-translate-y-0.5 hover:opacity-95",
      },
      size: {
        default: "h-12",
        sm: "h-10 px-4 text-xs",
        lg: "h-14 px-7 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({
  className,
  size,
  variant,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn("will-change-transform", buttonVariants({ className, size, variant }))}
      type={type}
      {...props}
    />
  );
}
