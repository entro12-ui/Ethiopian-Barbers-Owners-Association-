import Image from "next/image";
import { LOGO_ALT, LOGO_PATH } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  priority?: boolean;
  alt?: string;
}

const sizes = {
  sm: { image: 40, className: "w-10 h-10" },
  md: { image: 56, className: "w-14 h-14" },
  lg: { image: 72, className: "w-[4.5rem] h-[4.5rem]" },
  xl: { image: 112, className: "w-28 h-28" },
};

export default function Logo({ size = "md", className, priority = false, alt = LOGO_ALT }: LogoProps) {
  const config = sizes[size];

  return (
    <div
      className={cn(
        "relative shrink-0 rounded-full overflow-hidden ring-2 ring-gold/40 shadow-lg shadow-black/25 hover:ring-gold/70 transition-all",
        config.className,
        className
      )}
    >
      <Image
        src={LOGO_PATH}
        alt={alt}
        width={config.image}
        height={config.image}
        className="w-full h-full object-cover"
        priority={priority}
      />
    </div>
  );
}

export { LOGO_PATH, LOGO_ALT };
