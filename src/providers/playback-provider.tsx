import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import type { Track } from "@/src/lib/tracks";

type PlaybackContextValue = {
  currentIndex: number;
  currentTrack: Track | null;
  durationMs: number;
  error: string | null;
  hasQueue: boolean;
  isBuffering: boolean;
  isLoaded: boolean;
  isPlaying: boolean;
  positionMs: number;
  queue: Track[];
  autoAdvanceOnFinish: boolean;
  jumpByMs: (delta: number) => Promise<void>;
  playNext: () => void;
  playPrevious: () => void;
  seekToFraction: (fraction: number) => Promise<void>;
  selectTrack: (trackId: string, nextQueue?: Track[]) => void;
  togglePlay: () => Promise<void>;
  setAutoAdvanceOnFinish: (enabled: boolean) => void;
  stopPlayback: () => void;
};

const PlaybackContext = createContext<PlaybackContextValue | null>(null);

export function PlaybackProvider({ children }: { children: ReactNode }) {
  const [queue, setQueue] = useState<Track[]>([]);
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [autoAdvanceOnFinish, setAutoAdvanceOnFinish] = useState(true);

  const currentIndex = useMemo(() => {
    if (!queue.length) return -1;
    if (!currentTrackId) return 0;

    const nextIndex = queue.findIndex((track) => track.id === currentTrackId);
    return nextIndex >= 0 ? nextIndex : 0;
  }, [currentTrackId, queue]);

  const currentTrack = currentIndex >= 0 ? queue[currentIndex] ?? null : null;
  const player = useAudioPlayer(currentTrack?.url ?? null, {
    updateInterval: 450,
    downloadFirst: true,
  });
  const status = useAudioPlayerStatus(player);
  const durationMs = Math.floor((status.duration ?? 0) * 1000);
  const positionMs = Math.floor((status.currentTime ?? 0) * 1000);
  const isLoaded = Boolean(status.isLoaded);
  const isPlaying = Boolean(status.playing);
  const isBuffering = Boolean(status.isBuffering);

  useEffect(() => {
    setAudioModeAsync({
      allowsRecording: false,
      shouldPlayInBackground: false,
      playsInSilentMode: true,
      interruptionMode: "doNotMix",
      shouldRouteThroughEarpiece: false,
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (currentTrack?.url && status.isLoaded) {
      try {
        player.play();
      } catch {
        setError("Unable to start playback. Please try again.");
      }
    }
  }, [currentTrack?.url, player, status.isLoaded]);

  useEffect(() => {
    if (status.didJustFinish && autoAdvanceOnFinish && queue.length > 0) {
      const nextIndex = (currentIndex + 1) % queue.length;
      setCurrentTrackId(queue[nextIndex]?.id ?? null);
    }
  }, [autoAdvanceOnFinish, currentIndex, queue, status.didJustFinish]);

  const selectTrack = (trackId: string, nextQueue?: Track[]) => {
    setError(null);

    if (nextQueue?.length) {
      setQueue(nextQueue);

      const nextTrack = nextQueue.find((track) => track.id === trackId) ?? nextQueue[0];
      setCurrentTrackId(nextTrack?.id ?? null);
      return;
    }

    setCurrentTrackId(trackId);
  };

  const togglePlay = async () => {
    if (!currentTrack) return;

    try {
      setError(null);
      if (isPlaying) {
        player.pause();
      } else {
        player.play();
      }
    } catch {
      setError("Playback control failed. Please try again in a moment.");
    }
  };

  const stopPlayback = () => {
    try {
      player.pause();
    } catch {
      // ignore
    }

    setError(null);
    setQueue([]);
    setCurrentTrackId(null);
  };

  const seekToFraction = async (fraction: number) => {
    if (!durationMs) return;

    const clamped = Math.max(0, Math.min(1, fraction));
    const nextPosition = Math.floor(durationMs * clamped);

    try {
      setError(null);
      await player.seekTo(nextPosition / 1000);
    } catch {
      setError("Seeking failed. Please try again in a moment.");
    }
  };

  const jumpByMs = async (delta: number) => {
    if (!durationMs) return;

    const nextPosition = Math.max(0, Math.min(durationMs, positionMs + delta));

    try {
      setError(null);
      await player.seekTo(nextPosition / 1000);
    } catch {
      setError("Unable to adjust playback progress right now.");
    }
  };

  const playPrevious = () => {
    if (!queue.length) return;
    const nextIndex = (currentIndex - 1 + queue.length) % queue.length;
    setCurrentTrackId(queue[nextIndex]?.id ?? null);
  };

  const playNext = () => {
    if (!queue.length) return;
    const nextIndex = (currentIndex + 1) % queue.length;
    setCurrentTrackId(queue[nextIndex]?.id ?? null);
  };

  const value: PlaybackContextValue = {
    currentIndex,
    currentTrack,
    durationMs,
    error,
    hasQueue: queue.length > 0,
    isBuffering,
    isLoaded,
    isPlaying,
    positionMs,
    queue,
    autoAdvanceOnFinish,
    jumpByMs,
    playNext,
    playPrevious,
    seekToFraction,
    selectTrack,
    togglePlay,
    setAutoAdvanceOnFinish,
    stopPlayback,
  };

  return <PlaybackContext.Provider value={value}>{children}</PlaybackContext.Provider>;
}

export function usePlayback() {
  const context = useContext(PlaybackContext);
  if (!context) {
    throw new Error("usePlayback must be used within PlaybackProvider");
  }

  return context;
}
