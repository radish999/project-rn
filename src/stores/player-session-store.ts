import type { Track, TrackCategory } from "@/src/lib/tracks";
import { create } from "zustand";

type PlayerSessionState = {
  selectedTrackId: string | null;
  tracksSnapshot: Track[];
  query: string;
  category: TrackCategory;
  setSession: (session: {
    selectedTrackId: string;
    tracksSnapshot: Track[];
    query: string;
    category: TrackCategory;
  }) => void;
  clearSession: () => void;
};

export const usePlayerSessionStore = create<PlayerSessionState>((set) => ({
  selectedTrackId: null,
  tracksSnapshot: [],
  query: "",
  category: "featured",
  setSession: ({ selectedTrackId, tracksSnapshot, query, category }) =>
    set({
      selectedTrackId,
      tracksSnapshot,
      query,
      category,
    }),
  clearSession: () =>
    set({
      selectedTrackId: null,
      tracksSnapshot: [],
      query: "",
      category: "featured",
    }),
}));

