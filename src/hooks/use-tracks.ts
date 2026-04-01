import { useEffect, useMemo, useState } from "react";

import { fetchJamendoTracks, hasJamendoClientId } from "@/src/api/jamendo";
import { fallbackTracks, filterTracks, type Track } from "@/src/lib/tracks";

type TrackSource = "jamendo" | "fallback";

type UseTracksResult = {
  error: string | null;
  isLoading: boolean;
  source: TrackSource;
  tracks: Track[];
};

export function useTracks(query: string): UseTracksResult {
  const [tracks, setTracks] = useState<Track[]>(fallbackTracks);
  const [isLoading, setIsLoading] = useState(hasJamendoClientId());
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<TrackSource>(
    hasJamendoClientId() ? "jamendo" : "fallback"
  );

  const fallbackData = useMemo(() => {
    return filterTracks(fallbackTracks, query);
  }, [query]);

  useEffect(() => {
    if (!hasJamendoClientId()) {
      setTracks(fallbackData);
      setSource("fallback");
      setIsLoading(false);
      setError("未配置 Jamendo client_id，当前使用本地示例歌单。");
      return;
    }

    let isCancelled = false;
    setIsLoading(true);

    const timer = setTimeout(async () => {
      try {
        const nextTracks = await fetchJamendoTracks(query);
        if (isCancelled) return;

        setTracks(nextTracks);
        setSource("jamendo");
        setError(null);
      } catch (err) {
        if (isCancelled) return;

        setTracks(fallbackData);
        setSource("fallback");
        setError(
          err instanceof Error
            ? `${err.message}，当前已切换到本地示例歌单。`
            : "Jamendo 加载失败，当前已切换到本地示例歌单。"
        );
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }, 350);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [fallbackData, query]);

  return {
    error,
    isLoading,
    source,
    tracks,
  };
}
