"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Users } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { SwipeButtons } from "@/components/SwipeButtons";
import SwipeCard from "@/components/SwipeCard";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import { createInteraction, discoverPeople } from "@/lib/api";
import { useSwipeStore } from "@/stores/swipeStore";

interface SwipeCardRef {
  triggerSwipe: (liked: boolean) => void;
}

export function SwipeArea() {
  const {
    data: users,
    status,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: discoverPeople,
    refetchOnWindowFocus: false,
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentCardRef = useRef<SwipeCardRef>(null);
  const resetDragOffset = useSwipeStore((state) => state.resetDragOffset);
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: createInteraction,
    onSuccess: (result) => {
      setCurrentIndex((prev) => prev + 1);
      resetDragOffset();
      queryClient.invalidateQueries({ queryKey: ["matches"] });

      if (result.matchId) {
        toast.success("It's a match! You can now start chatting.");
      }
    },
    onError: (error) => {
      toast.error(`Error creating interaction: ${error.message}`);
    },
  });

  function handleSwipe(liked: boolean, index: number) {
    if (!users) return;

    const highlightedUser = users[index];
    if (highlightedUser) {
      // // Just for debugging
      // setCurrentIndex((prev) => prev + 1);
      // resetDragOffset();
      // toast.success(
      //   liked ? `You liked ${highlightedUser.name}` : `You passed on ${highlightedUser.name}`,
      // );

      likeMutation.mutate({
        toUser: highlightedUser.id,
        isLike: liked,
      });
    }
  }

  if (status === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-red-500">Error loading users: {(error as Error).message}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center overflow-hidden p-4">
      <div className="relative w-full max-w-sm">
        {status === "pending" ? (
          <div className="flex h-[550px] items-center justify-center">
            <div className="text-center">
              <Spinner className="border-primary stroke-primary mx-auto mb-4 size-8" />
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </div>
        ) : !users[currentIndex] ? (
          <div className="flex h-[550px] flex-1 items-center justify-center">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon" className="size-20 bg-transparent">
                  <Users className="text-muted-foreground size-20" />
                </EmptyMedia>
                <EmptyTitle>No more users</EmptyTitle>
                <EmptyDescription>
                  You've seen all available users. Check back later!
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </div>
        ) : (
          <div className="relative h-[550px]">
            {users.map((user, index) => (
              <SwipeCard
                key={user.id}
                ref={index === currentIndex ? currentCardRef : undefined}
                user={user}
                disabled={likeMutation.isPending}
                onSwipe={(liked) => handleSwipe(liked, index)}
                style={{ zIndex: users.length - index }}
              />
            ))}
          </div>
        )}

        {/* Like and Pass buttons */}
        {status === "success" && users[currentIndex] && (
          <SwipeButtons
            onLike={() => currentCardRef.current?.triggerSwipe(true)}
            onPass={() => currentCardRef.current?.triggerSwipe(false)}
            disabled={likeMutation.isPending}
          />
        )}
      </div>
    </div>
  );
}
