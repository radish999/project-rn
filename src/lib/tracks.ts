import type { ImageSourcePropType } from "react-native";

export type Track = {
  id: string;
  title: string;
  artist: string;
  artwork: ImageSourcePropType;
  url: string;
};

export const fallbackTracks: Track[] = [
  {
    id: "fallback-s1",
    title: "SoundHelix 1",
    artist: "SoundHelix",
    artwork: require("../../assets/images/react-logo.png"),
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: "fallback-s2",
    title: "SoundHelix 2",
    artist: "SoundHelix",
    artwork: require("../../assets/images/react-logo.png"),
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: "fallback-s3",
    title: "SoundHelix 3",
    artist: "SoundHelix",
    artwork: require("../../assets/images/react-logo.png"),
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
];

export function filterTracks(tracks: Track[], query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return tracks;

  return tracks.filter((track) => {
    return (
      track.title.toLowerCase().includes(q) ||
      track.artist.toLowerCase().includes(q)
    );
  });
}

export function getTrackIndexById(tracks: Track[], id: string) {
  const index = tracks.findIndex((track) => track.id === id);
  return index < 0 ? 0 : index;
}
