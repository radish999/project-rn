import { useEffect, useMemo, useState } from "react";

import { fetchJamendoTracks, hasJamendoClientId } from "@/src/api/jamendo";
import {
  fallbackTracks,
  filterTracks,
  type Track,
  type TrackCategory,
} from "@/src/lib/tracks";

type TrackSource = "jamendo" | "fallback";

type UseTracksResult = {
  error: string | null;
  isLoading: boolean;
  source: TrackSource;
  tracks: Track[];
};

export function useTracks(query: string, category: TrackCategory): UseTracksResult {
  const [tracks, setTracks] = useState<Track[]>(
    hasJamendoClientId() ? [] : fallbackTracks
  );
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
    setError(null);

    const timer = setTimeout(async () => {
      try {
        const nextTracks = await fetchJamendoTracks(query, category);
        if (isCancelled) return;

        setTracks(nextTracks);
        setSource("jamendo");
        setError(null);
      } catch (err) {
        if (isCancelled) return;

        setTracks([]);
        setSource("jamendo");
        setError(
          err instanceof Error
            ? `${err.message}，未能获取在线歌单。`
            : "Jamendo 加载失败，未能获取在线歌单。"
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
  }, [category, fallbackData, query]);

  return {
    error,
    isLoading,
    source,
    tracks,
  };
}
