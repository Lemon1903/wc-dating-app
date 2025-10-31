import { create } from "zustand";

interface SwipeState {
  dragOffset: number;
  setDragOffset: (offset: number) => void;
  resetDragOffset: () => void;
}

export const useSwipeStore = create<SwipeState>((set) => ({
  dragOffset: 0,
  setDragOffset: (offset) => set({ dragOffset: offset }),
  resetDragOffset: () => set({ dragOffset: 0 }),
}));