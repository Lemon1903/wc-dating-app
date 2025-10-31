import { Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendMessage } from "@/lib/api";
import { realtimeService } from "@/services/realtimeService";
import { useMutation } from "@tanstack/react-query";

interface ConversationInputProps {
  conversationId: string;
}

export default function ConversationInput({ conversationId }: ConversationInputProps) {
  const [messageText, setMessageText] = useState("");

  const sendMessageMutation = useMutation({
    mutationFn: ({ conversationId, text }: { conversationId: string; text: string }) => {
      return sendMessage(conversationId, text);
    },
    onSuccess: (createdMessage) => {
      setMessageText("");

      // Also broadcast for other users
      console.log("Broadcasting message from ConversationInput:", createdMessage);
      realtimeService.broadcastMessage(conversationId, createdMessage);
    },
    onError: (error: Error) => {
      toast.error(`Failed to send message: ${error.message}`);
    },
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    sendMessageMutation.mutate({
      conversationId,
      text: messageText.trim(),
    });
  };

  return (
    <div className="border-t p-4">
      <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
        <Input
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1"
          disabled={sendMessageMutation.isPending}
        />
        <Button
          type="submit"
          size="sm"
          disabled={!messageText.trim() || sendMessageMutation.isPending}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
