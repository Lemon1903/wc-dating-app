import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, getFirstName } from "@/lib/utils";
import { useConversationStore } from "@/stores/conversationStore";
import { Conversation } from "@/types";

interface ConversationPreviewProps {
  conversation: Conversation;
  onClick?: () => void;
}

export default function ConversationPreview({ conversation, onClick }: ConversationPreviewProps) {
  const isActive = useConversationStore(
    (state) => state.selectedConversation?.id === conversation.id,
  );

  return (
    <div
      className={cn(
        "hover:bg-muted flex cursor-pointer items-center space-x-3 rounded-lg p-3 transition-colors",
        isActive && "bg-muted/60",
      )}
      onClick={onClick}
    >
      <Avatar>
        <AvatarImage
          src={conversation.otherUser.profilePhotos[0]}
          alt={conversation.otherUser.name}
        />
        <AvatarFallback>{getFirstName(conversation.otherUser.name).charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{conversation.otherUser.name}</p>
        <p className="text-muted-foreground truncate text-sm">
          {conversation.messages.length > 0 ? conversation.messages[0].text : "No messages yet"}
        </p>
      </div>
    </div>
  );
}
