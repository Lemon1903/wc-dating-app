"use client";

import { useQuery } from "@tanstack/react-query";
import { Heart } from "lucide-react";

import MatchPhoto from "@/components/MatchPhoto";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import { getMatches } from "@/lib/api";

export function MatchesTab() {
  const {
    data: matches,
    status,
    error,
  } = useQuery({
    queryKey: ["matches"],
    queryFn: getMatches,
  });

  return (
    <div className="space-y-4">
      {status === "error" ? (
        <div className="text-red-500">Error loading matches: {(error as Error).message}</div>
      ) : status === "pending" ? (
        <div className="flex items-center justify-center py-16">
          <Spinner className="size-8" />
        </div>
      ) : matches.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon" className="size-20 bg-transparent">
              <Heart className="text-muted-foreground size-20" />
            </EmptyMedia>
            <EmptyTitle>No Matches Yet</EmptyTitle>
            <EmptyDescription>
              Start swiping to find your perfect match! Like profiles that catch your eye and see
              who likes you back.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {matches.map((match) => (
            <MatchPhoto key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}
