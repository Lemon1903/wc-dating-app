import { Heart, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSwipeStore } from "@/stores/swipeStore";

interface SwipeButtonsProps {
  onLike: () => void;
  onPass: () => void;
  disabled?: boolean;
}

const DRAG_ENLARGE_THRESHOLD = 3; // Minimum drag offset to trigger button enlargement

export function SwipeButtons({ onLike, onPass, disabled }: SwipeButtonsProps) {
  const dragOffset = useSwipeStore((state) => state.dragOffset);

  return (
    <div className="absolute -bottom-8 left-1/2 z-20 -mt-8 flex -translate-x-1/2 justify-center space-x-8">
      <Button
        size="lg"
        className={cn(
          "size-16 overflow-hidden rounded-full bg-white shadow-lg transition-transform duration-200 hover:scale-105 hover:bg-white",
          dragOffset < -DRAG_ENLARGE_THRESHOLD && "scale-110", // Enlarge when dragging left (pass)
          dragOffset > DRAG_ENLARGE_THRESHOLD && "scale-75 opacity-0", // Hide when dragging right (like)
        )}
        disabled={disabled}
        onClick={onPass}
      >
        <X
          className={cn(
            "text-destructive size-8 stroke-3 transition-all",
            dragOffset < -DRAG_ENLARGE_THRESHOLD && "scale-[1200%]",
          )}
        />
        <X
          className={cn(
            "absolute m-auto size-8 scale-0 stroke-3 text-white transition-all",
            dragOffset < -DRAG_ENLARGE_THRESHOLD && "scale-100",
          )}
        />
      </Button>
      <Button
        size="lg"
        className={cn(
          "size-16 overflow-hidden rounded-full bg-white shadow-lg transition-transform duration-200 hover:scale-105 hover:bg-white",
          dragOffset > DRAG_ENLARGE_THRESHOLD && "scale-110", // Enlarge when dragging right (like)
          dragOffset < -DRAG_ENLARGE_THRESHOLD && "scale-75 opacity-0", // Hide when dragging left (pass)
        )}
        disabled={disabled}
        onClick={onLike}
      >
        <Heart
          className={cn(
            "size-8 fill-green-500 text-green-500 transition-all",
            dragOffset > DRAG_ENLARGE_THRESHOLD && "scale-[550%]",
          )}
        />
        <Heart
          className={cn(
            "absolute m-auto size-8 scale-0 fill-white text-white transition-all",
            dragOffset > DRAG_ENLARGE_THRESHOLD && "scale-100",
          )}
        />
      </Button>
    </div>
  );
}
