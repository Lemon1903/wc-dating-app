import { cn } from "@/lib/utils";
import { Message, Profile } from "@/types";
import { useSession } from "next-auth/react";

interface MessageBubbleProps {
  message: Message;
  otherUser: Profile;
}

export default function MessageBubble({ message, otherUser }: MessageBubbleProps) {
  const { data: session } = useSession();
  const isOwnMessage = message.senderId === session?.user.id;

  return (
    <div className={cn("flex justify-start", isOwnMessage && "justify-end")}>
      <div
        className={cn(
          "bg-muted max-w-xs rounded-lg px-3 py-2",
          isOwnMessage && "bg-primary text-primary-foreground",
        )}
      >
        {!isOwnMessage && (
          <div className="text-muted-foreground mb-1 text-xs font-medium">{otherUser.name}</div>
        )}
        <p className="text-sm">{message.text}</p>
        <p className="mt-1 text-xs opacity-70">
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}
