"use client";

import { useQuery } from "@tanstack/react-query";
import { MessageCircle } from "lucide-react";
import { useSession } from "next-auth/react";

import { ConversationPanel } from "@/components/ConversationPanel";
import ConversationPreview from "@/components/ConversationPreview";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { getConversations } from "@/lib/api";
import { useConversationStore } from "@/stores/conversationStore";
import { Conversation } from "@/types";

export function MessagesTab() {
  const { data: session, status: sessionStatus } = useSession();
  const openConversation = useConversationStore((state) => state.openConversation);

  const { data: conversations, status: conversationsStatus } = useQuery({
    queryKey: ["conversations", session?.user.id],
    queryFn: getConversations,
    enabled: sessionStatus === "authenticated",
  });

  function handleConversationClick(conversation: Conversation) {
    openConversation(conversation);
  }

  if (sessionStatus === "loading" || conversationsStatus === "pending") {
    return (
      <div className="space-y-4 p-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!conversations || conversations.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon" className="size-20 bg-transparent">
            <MessageCircle className="text-muted-foreground size-20" />
          </EmptyMedia>
          <EmptyTitle>Start Chatting</EmptyTitle>
          <EmptyDescription>
            Ready to connect? Once you match with someone, you can start a conversation right here
            in the Messages tab.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {conversations.map((conversation) => (
          <ConversationPreview
            key={conversation.id}
            conversation={conversation}
            onClick={() => handleConversationClick(conversation)}
          />
        ))}
      </div>

      <ConversationPanel />
    </>
  );
}
