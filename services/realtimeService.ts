import { supabase } from "@/lib/supabase";
import { Message } from "@/types";
import { RealtimeChannel } from "@supabase/supabase-js";

export class RealtimeService {
  private static instance: RealtimeService;
  private messageListeners: Map<string, (message: Message) => void> = new Map();
  private channels: Map<string, RealtimeChannel> = new Map();

  private constructor() {}

  static getInstance(): RealtimeService {
    if (!RealtimeService.instance) {
      RealtimeService.instance = new RealtimeService();
    }
    return RealtimeService.instance;
  }

  // Subscribe to messages for a specific conversation
  onMessage(conversationId: string, callback: (message: Message) => void) {
    this.messageListeners.set(conversationId, callback);

    // Create channel for this conversation
    const channel = this.createChannel(conversationId);

    // Return unsubscribe function
    return () => {
      this.messageListeners.delete(conversationId);
      supabase.removeChannel(channel);
      this.channels.delete(conversationId);
    };
  }

  // Broadcast a new message (called after successfully sending via API)
  async broadcastMessage(conversationId: string, message: Message) {
    try {
      let channel = this.channels.get(conversationId);

      // Create channel if it doesn't exist
      if (!channel) {
        channel = this.createChannel(conversationId);
      }

      // Send the broadcast
      await channel.send({
        type: "broadcast",
        event: "message_created",
        payload: message,
      });
    } catch (error) {
      console.error("Failed to broadcast message:", error);
    }
  }

  // Clean up all subscriptions
  cleanup() {
    this.messageListeners.clear();
    this.channels.forEach((channel) => {
      supabase.removeChannel(channel);
    });
    this.channels.clear();
  }

  private notifyMessageListeners(conversationId: string, message: Message) {
    const listener = this.messageListeners.get(conversationId);
    if (listener) {
      listener(message);
    }
  }

  private createChannel(conversationId: string) {
    const channelName = `conversation:${conversationId}:messages`;
    const channel = supabase.channel(channelName, {
      config: {
        broadcast: { self: true }, // Allow receiving own broadcasts
      },
    });

    // Listen for message broadcasts
    channel
      .on("broadcast", { event: "message_created" }, (payload) => {
        const message: Message = payload.payload;
        this.notifyMessageListeners(conversationId, message);
      })
      .subscribe();

    this.channels.set(conversationId, channel);

    return channel;
  }
}

export const realtimeService = RealtimeService.getInstance();
