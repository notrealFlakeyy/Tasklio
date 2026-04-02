"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";

import { cn } from "@/lib/utils";

export type ChartConfig = Record<
  string,
  {
    color: string;
    label?: string;
  }
>;

const ChartContext = React.createContext<ChartConfig | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error("Chart components must be used inside ChartContainer.");
  }

  return context;
}

export function ChartContainer({
  children,
  className,
  config,
}: {
  children: React.ReactNode;
  className?: string;
  config: ChartConfig;
}) {
  const style = Object.entries(config).reduce<Record<string, string>>(
    (accumulator, [key, value]) => {
      accumulator[`--color-${key}`] = value.color;
      return accumulator;
    },
    {},
  );

  return (
    <ChartContext.Provider value={config}>
      <div
        className={cn(
          "w-full [&_.recharts-cartesian-axis-tick_text]:fill-[var(--color-muted)] [&_.recharts-cartesian-grid_line]:stroke-[rgba(120,100,82,0.12)] [&_.recharts-curve.recharts-tooltip-cursor]:stroke-[rgba(120,100,82,0.2)] [&_.recharts-layer]:outline-none",
          className,
        )}
        style={style as React.CSSProperties}
      >
        {children}
      </div>
    </ChartContext.Provider>
  );
}

export const ChartTooltip = RechartsPrimitive.Tooltip;

export function ChartTooltipContent({
  active,
  className,
  label,
  payload,
  valueFormatter,
}: {
  active?: boolean;
  className?: string;
  label?: string;
  payload?: Array<{
    color?: string;
    dataKey?: string | number;
    name?: string;
    value?: number | string;
  }>;
  valueFormatter?: (value: number | string, name: string) => string;
}) {
  const config = useChart();

  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div
      className={cn(
        "grid min-w-[11rem] gap-2 rounded-[22px] border border-[color:var(--color-border)] bg-[rgba(255,255,255,0.96)] px-4 py-3 text-sm shadow-[0_20px_45px_rgba(68,55,48,0.12)] backdrop-blur-sm",
        className,
      )}
    >
      {label ? (
        <div className="text-xs font-semibold tracking-[0.16em] text-[var(--color-muted)] uppercase">
          {label}
        </div>
      ) : null}
      <div className="grid gap-2">
        {payload.map((item) => {
          const key = String(item.dataKey ?? item.name ?? "value");
          const entry = config[key];
          const itemLabel = entry?.label ?? item.name ?? key;
          const itemValue = item.value ?? "";

          return (
            <div className="flex items-center justify-between gap-4" key={key}>
              <div className="flex items-center gap-2">
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: item.color ?? entry?.color }}
                />
                <span className="text-[var(--color-muted)]">{itemLabel}</span>
              </div>
              <span className="font-semibold text-[var(--color-ink)]">
                {valueFormatter
                  ? valueFormatter(itemValue, String(itemLabel))
                  : String(itemValue)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
