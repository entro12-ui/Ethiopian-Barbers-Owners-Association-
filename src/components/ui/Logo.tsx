import Image from "next/image";
import { cn } from "@/lib/utils";

const LOGO_PATH = "/images/eboa-logo.png";
const LOGO_ALT = "Ethiopian Barbers and Owners Association logo";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  priority?: boolean;
}

const sizes = {
  sm: { image: 40, className: "w-10 h-10" },
  md: { image: 52, className: "w-12 h-12" },
  lg: { image: 64, className: "w-16 h-16" },
  xl: { image: 96, className: "w-24 h-24" },
};

export default function Logo({ size = "md", className, priority = false }: LogoProps) {
  const config = sizes[size];

  return (
    <div
      className={cn(
        "relative shrink-0 rounded-full overflow-hidden ring-2 ring-gold/30 shadow-lg shadow-black/20 hover:ring-gold/60 transition-all",
        config.className,
        className
      )}
    >
      <Image
        src={LOGO_PATH}
        alt={LOGO_ALT}
        width={config.image}
        height={config.image}
        className="w-full h-full object-cover"
        priority={priority}
      />
    </div>
  );
}

export { LOGO_PATH, LOGO_ALT };
