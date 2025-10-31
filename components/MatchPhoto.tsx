import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card } from "@/components/ui/card";
import { startConversation } from "@/lib/api";
import { calculateAge } from "@/lib/date-utils";
import { getFirstName } from "@/lib/utils";
import { Match } from "@/types";

interface MatchPhotoProps {
  match: Match;
}

function MatchPhoto({ match }: MatchPhotoProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // const { openConversation } = useConversationStore();

  const queryClient = useQueryClient();

  const startConversationMutation = useMutation({
    mutationFn: startConversation,
    onSuccess: (createdConversation) => {
      console.log("Conversation started with ID:", createdConversation.id);
      toast.success("You can now chat with " + getFirstName(match.otherUser.name) + "!");
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["matches"] });
      // openConversation(createdConversation);
    },
    onError: (error: Error) => {
      toast.error(`Error starting conversation: ${error.message}`);
    },
  });

  const age = calculateAge(new Date(match.otherUser.birthday));

  function handleClick() {
    setIsDialogOpen(true);
  }

  function handleConfirmStartConversation() {
    startConversationMutation.mutate(match.otherUser.id);
    setIsDialogOpen(false);
  }

  return (
    <>
      <Card
        key={match.id}
        className="group relative aspect-3/4 cursor-pointer p-0 transition-transform hover:scale-105 aria-disabled:opacity-60"
        aria-disabled={startConversationMutation.isPending}
        onClick={handleClick}
      >
        <Image
          src={match.otherUser.profilePhotos[0]}
          alt={`${match.otherUser.name} photo`}
          fill
          className="rounded-xl object-cover"
        />

        {/* Bottom gradient and details */}
        <div className="absolute right-0 bottom-0 left-0 z-10 rounded-b-xl bg-linear-to-t from-black via-black/78 to-transparent p-3">
          <div className="text-white">
            <div className="flex items-baseline gap-1 overflow-hidden">
              <h3 className="truncate text-lg font-bold">{getFirstName(match.otherUser.name)}</h3>
              <span className="shrink-0 text-base">{age}</span>
            </div>
          </div>
        </div>

        {/* Heart icon */}
        <div className="absolute -bottom-3 left-1/2 z-20 -translate-x-1/2">
          <Heart className="size-6 fill-red-500 text-red-500 drop-shadow-lg" />
        </div>
      </Card>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Start a conversation?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to start a conversation with{" "}
              {getFirstName(match.otherUser.name)}? This will allow you to chat and get to know each
              other better!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmStartConversation}>
              Start Conversation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default MatchPhoto;
