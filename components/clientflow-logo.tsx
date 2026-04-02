import { cn } from "@/lib/utils";

type ClientFlowLogoProps = {
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  size?: number;
  withWordmark?: boolean;
};

function getSizeClasses(size: number) {
  if (size >= 160) {
    return {
      subtitle: "text-sm md:text-[15px]",
      title: "text-5xl md:text-6xl",
    };
  }

  if (size >= 88) {
    return {
      subtitle: "text-sm",
      title: "text-4xl md:text-5xl",
    };
  }

  return {
    subtitle: "text-xs",
    title: "text-3xl",
  };
}

export function ClientFlowLogo({
  className,
  size = 88,
  withWordmark = false,
}: ClientFlowLogoProps) {
  const sizeClasses = getSizeClasses(size);

  return (
    <div className={cn("flex flex-col", className)}>
      <span
        className={cn(
          "font-[family-name:var(--font-fraunces)] font-semibold tracking-[-0.04em] text-[#443730]",
          sizeClasses.title,
        )}
      >
        ClientFlow
      </span>
      {withWordmark ? (
        <span className={cn("mt-2 leading-7 text-[#6a5b51]", sizeClasses.subtitle)}>
          Booking and client operations with a warmer, more premium feel
        </span>
      ) : null}
    </div>
  );
}
