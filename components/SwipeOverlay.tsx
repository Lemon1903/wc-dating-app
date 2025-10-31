import { FADE_IN_DURATION } from "@/components/SwipeCard";
import { motion, MotionValue } from "motion/react";

import { cn } from "@/lib/utils";

interface SwipeOverlayProps {
  type: "like" | "pass";
  dragOpacity: MotionValue<number>;
  buttonOverlayType?: "like" | "pass";
}

export function SwipeOverlay({ type, buttonOverlayType, dragOpacity }: SwipeOverlayProps) {
  const isLike = type === "like";

  const positionClasses = cn(
    "pointer-events-none absolute z-50",
    isLike ? "top-20 left-8" : "top-16 right-8",
  );

  const textClasses = cn(
    "transform rounded-lg border-4 bg-white/90 font-bold",
    isLike
      ? "border-green-500 text-green-500 -rotate-12 px-6 py-3 text-7xl"
      : "border-red-500 text-red-500 rotate-12 px-4 py-2 text-5xl",
  );

  const text = isLike ? "LIKE" : "NOPE";

  return (
    <motion.div
      className={positionClasses}
      initial={{ opacity: 0 }}
      animate={{
        opacity: buttonOverlayType === type ? 1 : 0,
      }}
      transition={{ duration: FADE_IN_DURATION }}
      style={{
        opacity: buttonOverlayType === type ? undefined : dragOpacity,
      }}
    >
      <div className={textClasses}>{text}</div>
    </motion.div>
  );
}
