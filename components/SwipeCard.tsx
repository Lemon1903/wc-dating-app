"use client";

import { motion, useMotionValue, useTransform } from "motion/react";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";

import { useSwipeStore } from "@/stores/swipeStore";

import { Profile } from "@/types";

import ProfilePreviewCard from "@/components/ProfilePreviewCard";
import { SwipeOverlay } from "@/components/SwipeOverlay";
import { cn } from "@/lib/utils";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface SwipeCardRef {
  triggerSwipe: (liked: boolean) => void;
}

interface SwipeCardProps {
  user: Profile;
  disabled?: boolean;
  onSwipe?: (liked: boolean) => void;
  style?: React.CSSProperties;
}

export const EXIT_DISTANCE = 1000;
export const DISTANCE_THRESHOLD = 200; // Distance threshold for swiping away
export const OVERLAY_THRESHOLD = 25; // Minimum drag distance before overlay appears
export const FADE_IN_DISTANCE = 100; // Distance over which overlay fades in
export const FADE_IN_DURATION = 0.3; // Duration of fade-in animation in seconds
export const ROTATION_FACTOR = 24; // Factor to control rotation sensitivity

const SwipeCard = forwardRef<SwipeCardRef, SwipeCardProps>(
  ({ user, disabled = false, onSwipe, style }, ref) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [dragStartY, setDragStartY] = useState(0);
    const [exitX, setExitX] = useState(0);
    const [hasExited, setHasExited] = useState(false);
    const [buttonOverlayType, setButtonOverlayType] = useState<"like" | "pass">();
    const [hasSwiped, setHasSwiped] = useState(false);

    const x = useMotionValue(0);
    const { setDragOffset } = useSwipeStore();
    const throttleRef = useRef<number | undefined>(undefined);

    // Throttled drag position reporting to global store for button feedback
    const throttledSetDragOffset = useCallback(
      (value: number) => {
        if (throttleRef.current) {
          cancelAnimationFrame(throttleRef.current);
        }
        throttleRef.current = requestAnimationFrame(() => {
          // Don't update drag offset if card has been swiped or is disabled
          if (!hasSwiped && !disabled) {
            setDragOffset(value);
          }
        });
      },
      [setDragOffset, hasSwiped, disabled],
    );

    useEffect(() => {
      const unsubscribe = x.on("change", (value) => {
        throttledSetDragOffset(value);
      });
      return () => {
        unsubscribe();
        if (throttleRef.current) {
          cancelAnimationFrame(throttleRef.current);
        }
      };
    }, [x, throttledSetDragOffset]);

    // Calculate rotation based on drag position and where drag started
    const rotate = useTransform(x, (value) => {
      const rotationMultiplier = dragStartY < 0 ? 1 : -1; // Top half = 1, Bottom half = -1
      const rotation = (value / ROTATION_FACTOR) * rotationMultiplier;
      return rotation;
    });

    // Calculate opacity for like/pass overlays based on drag distance
    const likeOpacity = useTransform(x, (value) => {
      const progress = Math.min(Math.max((value - OVERLAY_THRESHOLD) / FADE_IN_DISTANCE, 0), 1); // Fade in over next 100px
      return progress;
    });

    const passOpacity = useTransform(x, (value) => {
      const progress = Math.min(Math.max((-value - OVERLAY_THRESHOLD) / FADE_IN_DISTANCE, 0), 1); // Fade in over next 100px
      return progress;
    });

    useImperativeHandle(ref, () => ({
      triggerSwipe: (liked: boolean) => {
        if (disabled) return; // Don't allow swiping when disabled

        setHasSwiped(true);
        setDragStartY(-1); // Simulate dragging from top for consistent rotation
        setButtonOverlayType(liked ? "like" : "pass");

        // Trigger exit animation after overlay fades in
        setTimeout(() => {
          setExitX(liked ? EXIT_DISTANCE : -EXIT_DISTANCE);
          onSwipe?.(liked);
        }, FADE_IN_DURATION * 1000);
      },
    }));
    function handleDragStart(event: MouseEvent | TouchEvent | PointerEvent) {
      if (!cardRef.current) return;

      // Get the card's position and dimensions
      const rect = cardRef.current.getBoundingClientRect();
      const cardCenterY = rect.top + rect.height / 2;

      // Determine click position relative to card center
      let clientY: number;
      if ("touches" in event) {
        clientY = event.touches[0].clientY;
      } else {
        clientY = (event as MouseEvent | PointerEvent).clientY;
      }

      // Store normalized Y position (-1 for top, 1 for bottom)
      setDragStartY(clientY < cardCenterY ? -1 : 1);
    }

    function handleDragEnd() {
      const currentX = x.get();

      // Swipe away with animation
      if (Math.abs(currentX) > DISTANCE_THRESHOLD) {
        setHasSwiped(true);
        setExitX(currentX > 0 ? EXIT_DISTANCE : -EXIT_DISTANCE);
        onSwipe?.(currentX > 0); // true for like, false for pass
      } else {
        // Snap back to center if not crossing threshold
        setExitX(0);
      }
    }

    function handleAnimationComplete() {
      if (exitX !== 0) {
        setHasExited(true);
        setButtonOverlayType(undefined);
      }
    }

    if (hasExited) {
      return null;
    }

    return (
      <motion.div
        ref={cardRef}
        drag={disabled ? false : "x"}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={1}
        className={cn("absolute inset-0", disabled && "cursor-not-allowed")}
        style={{ x, rotate, ...style }}
        animate={{ x: exitX }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
        }}
        onDragStart={disabled ? undefined : handleDragStart}
        onDragEnd={disabled ? undefined : handleDragEnd}
        onAnimationComplete={handleAnimationComplete}
      >
        <ProfilePreviewCard currentUser={user} />

        {/* Like overlay */}
        <SwipeOverlay type="like" buttonOverlayType={buttonOverlayType} dragOpacity={likeOpacity} />

        {/* Pass overlay */}
        <SwipeOverlay type="pass" buttonOverlayType={buttonOverlayType} dragOpacity={passOpacity} />

        {/* Disabled overlay */}
        {disabled && (
          <div className="pointer-events-none absolute inset-0 z-50 rounded-lg bg-black/30" />
        )}
      </motion.div>
    );
  },
);

export default SwipeCard;
