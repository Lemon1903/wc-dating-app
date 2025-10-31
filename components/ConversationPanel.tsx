"use client";

import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import ConversationInput from "@/components/ConversationInput";
import MessageBubble from "@/components/MessageBubble";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getMessages } from "@/lib/api";
import { cn, getFirstName } from "@/lib/utils";
import { realtimeService } from "@/services/realtimeService";
import { useConversationStore } from "@/stores/conversationStore";
import { Message } from "@/types";

export function ConversationPanel() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const { selectedConversation, closeConversationPanel } = useConversationStore();

  // Fetch messages once when conversation opens
  useEffect(() => {
    if (!selectedConversation?.id) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      setIsLoadingMessages(true);
      try {
        const fetchedMessages = await getMessages(selectedConversation.id);
        setMessages(fetchedMessages);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setIsLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [selectedConversation?.id]);

  // Set up realtime subscription when conversation changes
  useEffect(() => {
    if (!selectedConversation?.id) return;

    const unsubscribe = realtimeService.onMessage(selectedConversation.id, (newMessage) => {
      console.log("Received realtime message:", newMessage);
      // Add new message to local state instead of refetching
      setMessages((prevMessages) => {
        // Check if message already exists to prevent duplicates
        const messageExists = prevMessages.some((m) => m.id === newMessage.id);
        if (messageExists) {
          console.log("Message already exists, skipping duplicate");
          return prevMessages;
        }
        return [...prevMessages, newMessage];
      });
    });

    return unsubscribe;
  }, [selectedConversation?.id, session?.user.id]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0) {
      const scrollContainer = document.querySelector(
        "[data-radix-scroll-area-viewport]",
      ) as HTMLElement;
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  if (!selectedConversation) return null;

  return (
    <div
      className={cn(
        "bg-background fixed top-0 right-0 z-50 flex h-full w-full translate-x-0 flex-col border-l transition-transform duration-300 ease-in-out md:w-[calc(100vw-24rem)]",
        !selectedConversation && "translate-x-full",
      )}
    >
      {/* Header */}
      <div className="flex items-center border-b p-4">
        <Button variant="ghost" size="sm" onClick={closeConversationPanel} className="mr-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Avatar className="mr-3">
          <AvatarImage
            src={selectedConversation.otherUser.profilePhotos[0]}
            alt={selectedConversation.otherUser.name}
          />
          <AvatarFallback>
            {getFirstName(selectedConversation.otherUser.name).charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold">{selectedConversation.otherUser.name}</h2>
          <p className="text-muted-foreground text-sm">
            {selectedConversation.otherUser.bio || "No bio available"}
          </p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="h-0 flex-1 p-4">
        <div className="space-y-4">
          {isLoadingMessages && (
            <div className="text-muted-foreground text-center">Loading messages...</div>
          )}

          {!isLoadingMessages && messages.length === 0 && (
            <div className="text-muted-foreground text-center">
              No messages yet. Start the conversation!
            </div>
          )}

          {!isLoadingMessages &&
            messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                otherUser={selectedConversation.otherUser}
              />
            ))}
        </div>
      </ScrollArea>

      <ConversationInput conversationId={selectedConversation.id} />
    </div>
  );
}
