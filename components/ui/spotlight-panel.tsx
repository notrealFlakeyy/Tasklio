"use client";

import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function SpotlightPanel({
  children,
  className,
  onPointerMove,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-[32px] border border-[color:var(--color-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,255,255,0.74))] shadow-[var(--shadow-soft)] transition-[transform,box-shadow,border-color] duration-300 hover:border-[color:var(--color-border-strong)] hover:shadow-[var(--shadow-elevated)]",
        className,
      )}
      onPointerMove={(event) => {
        if (event.pointerType && event.pointerType !== "mouse") {
          onPointerMove?.(event);
          return;
        }

        const rect = event.currentTarget.getBoundingClientRect();
        event.currentTarget.style.setProperty(
          "--pointer-x",
          `${event.clientX - rect.left}px`,
        );
        event.currentTarget.style.setProperty(
          "--pointer-y",
          `${event.clientY - rect.top}px`,
        );
        onPointerMove?.(event);
      }}
      onPointerLeave={(event) => {
        event.currentTarget.style.removeProperty("--pointer-x");
        event.currentTarget.style.removeProperty("--pointer-y");
      }}
      {...props}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(320px circle at var(--pointer-x, 50%) var(--pointer-y, 50%), rgba(230,253,255,0.9), transparent 62%)",
          }}
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(234,247,207,0.22),transparent_34%,rgba(230,253,255,0.2))] opacity-80" />
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />
      <div className="relative">{children}</div>
    </div>
  );
}
