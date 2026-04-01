import type { ImageSourcePropType } from "react-native";

export type Track = {
  id: string;
  title: string;
  artist: string;
  artwork: ImageSourcePropType;
  url: string;
};

export const tracks: Track[] = [
  {
    id: "s1",
    title: "SoundHelix 1",
    artist: "SoundHelix",
    artwork: require("../../assets/images/react-logo.png"),
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: "s2",
    title: "SoundHelix 2",
    artist: "SoundHelix",
    artwork: require("../../assets/images/react-logo.png"),
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: "s3",
    title: "SoundHelix 3",
    artist: "SoundHelix",
    artwork: require("../../assets/images/react-logo.png"),
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
];

export function getTrackIndexById(id: string) {
  const index = tracks.findIndex((t) => t.id === id);
  return index < 0 ? 0 : index;
}
