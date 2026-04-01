import type { Track, TrackCategory } from "@/src/lib/tracks";

const JAMENDO_BASE_URL = "https://api.jamendo.com/v3.0/tracks/";
const JAMENDO_CLIENT_ID = process.env.EXPO_PUBLIC_JAMENDO_CLIENT_ID;

type JamendoTrack = {
  id: string;
  name: string;
  artist_name: string;
  image?: string;
  album_image?: string;
  audio?: string;
};

type JamendoResponse = {
  results?: JamendoTrack[];
};

export function hasJamendoClientId() {
  return Boolean(JAMENDO_CLIENT_ID);
}

function getCategoryKeyword(category: TrackCategory) {
  switch (category) {
    case "pop":
      return "pop";
    case "electronic":
      return "electronic dance";
    case "night":
      return "chill ambient night";
    case "featured":
    default:
      return "";
  }
}

function buildJamendoUrl(query: string, category: TrackCategory) {
  if (!JAMENDO_CLIENT_ID) {
    throw new Error("Missing EXPO_PUBLIC_JAMENDO_CLIENT_ID");
  }

  const params = new URLSearchParams({
    client_id: JAMENDO_CLIENT_ID,
    format: "json",
    limit: "20",
    featured: "1",
    audioformat: "mp31",
    imagesize: "400",
    order: "popularity_total",
  });

  const categoryKeyword = getCategoryKeyword(category);
  const searchTerms = [categoryKeyword, query.trim()].filter(Boolean).join(" ");

  if (searchTerms) {
    params.set("search", searchTerms);
  }

  return `${JAMENDO_BASE_URL}?${params.toString()}`;
}

function mapJamendoTrack(track: JamendoTrack): Track | null {
  if (!track.audio) return null;

  return {
    id: String(track.id),
    title: track.name,
    artist: track.artist_name,
    artwork: {
      uri:
        track.image ||
        track.album_image ||
        "https://usercontent.jamendo.com?type=album&id=1&width=400",
    },
    url: track.audio,
  };
}

export async function fetchJamendoTracks(
  query = "",
  category: TrackCategory = "featured"
): Promise<Track[]> {
  const response = await fetch(buildJamendoUrl(query, category));

  if (!response.ok) {
    throw new Error(`Jamendo request failed with status ${response.status}`);
  }

  const data = (await response.json()) as JamendoResponse;
  const results = data.results ?? [];

  return results
    .map(mapJamendoTrack)
    .filter((track): track is Track => Boolean(track));
}
