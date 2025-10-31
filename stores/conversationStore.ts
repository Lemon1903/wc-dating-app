import { create } from "zustand";

import { Conversation } from "@/types";

interface ConversationState {
  selectedConversation: Conversation | null;
  openConversation: (conversation: Conversation | null) => void;
  closeConversationPanel: () => void;
}

export const useConversationStore = create<ConversationState>((set) => ({
  selectedConversation: null,
  openConversation: (conversation) => set({ selectedConversation: conversation }),
  closeConversationPanel: () => set({ selectedConversation: null }),
}));
