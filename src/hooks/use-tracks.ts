import { useEffect, useMemo, useState } from "react";

import {
  fetchJamendoTracks,
  hasJamendoClientId,
  JAMENDO_PAGE_SIZE,
} from "@/src/api/jamendo";
import {
  fallbackTracks,
  filterTracks,
  type Track,
  type TrackCategory,
} from "@/src/lib/tracks";

type TrackSource = "jamendo" | "fallback";

type UseTracksResult = {
  error: string | null;
  hasMore: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  loadMore: () => void;
  source: TrackSource;
  tracks: Track[];
};

export function useTracks(query: string, category: TrackCategory): UseTracksResult {
  const [tracks, setTracks] = useState<Track[]>(
    hasJamendoClientId() ? [] : fallbackTracks
  );
  const [isLoading, setIsLoading] = useState(hasJamendoClientId());
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(hasJamendoClientId());
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<TrackSource>(
    hasJamendoClientId() ? "jamendo" : "fallback"
  );
  const [page, setPage] = useState(0);

  const fallbackData = useMemo(() => {
    return filterTracks(fallbackTracks, query);
  }, [query]);

  useEffect(() => {
    if (!hasJamendoClientId()) {
      setTracks(fallbackData);
      setSource("fallback");
      setIsLoading(false);
      setIsLoadingMore(false);
      setHasMore(false);
      setPage(0);
      setError("Jamendo client_id is missing, so the app is using the local sample playlist.");
      return;
    }

    let isCancelled = false;
    setIsLoading(true);
    setIsLoadingMore(false);
    setHasMore(true);
    setPage(0);
    setError(null);
    setTracks([]);

    const timer = setTimeout(async () => {
      try {
        const nextTracks = await fetchJamendoTracks(query, category, 0);
        if (isCancelled) return;

        setTracks(nextTracks);
        setSource("jamendo");
        setHasMore(nextTracks.length === JAMENDO_PAGE_SIZE);
        setError(null);
      } catch (err) {
        if (isCancelled) return;

        setTracks([]);
        setSource("jamendo");
        setHasMore(false);
        setError(
          err instanceof Error
            ? `${err.message}. Unable to load the online playlist.`
            : "Jamendo failed to load the online playlist."
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

  const loadMore = () => {
    if (!hasJamendoClientId() || isLoading || isLoadingMore || !hasMore) {
      return;
    }

    const nextPage = page + 1;
    const offset = nextPage * JAMENDO_PAGE_SIZE;

    setIsLoadingMore(true);
    setError(null);

    void fetchJamendoTracks(query, category, offset)
      .then((nextTracks) => {
        setTracks((prevTracks) => {
          const seenIds = new Set(prevTracks.map((track) => track.id));
          const uniqueTracks = nextTracks.filter((track) => !seenIds.has(track.id));
          return [...prevTracks, ...uniqueTracks];
        });
        setPage(nextPage);
        setHasMore(nextTracks.length === JAMENDO_PAGE_SIZE);
      })
      .catch((err) => {
        setError(
          err instanceof Error
            ? `${err.message}. Unable to load more songs.`
            : "Jamendo failed while loading more songs."
        );
      })
      .finally(() => {
        setIsLoadingMore(false);
      });
  };

  return {
    error,
    hasMore,
    isLoading,
    isLoadingMore,
    loadMore,
    source,
    tracks,
  };
}
