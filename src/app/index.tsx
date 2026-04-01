import { Image } from "expo-image";
import { useMemo, useState } from "react";
import { useRouter } from "expo-router";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ImageBackground,
} from "react-native";

import { tracks } from "@/src/lib/tracks";

export default function Index() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tracks;
    return tracks.filter((t) => {
      return (
        t.title.toLowerCase().includes(q) ||
        t.artist.toLowerCase().includes(q)
      );
    });
  }, [query]);

  return (
    <ImageBackground
      source={require("@/assets/images/bg.jpg")}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <View style={styles.container}>
        <Text style={styles.title}>曲库</Text>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="搜索歌名/歌手"
          placeholderTextColor="rgba(255,255,255,0.7)"
          style={styles.search}
        />
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Pressable
              style={styles.item}
              onPress={() =>
                router.push({ pathname: "./player", params: { id: item.id } })
              }
            >
              <Image source={item.artwork} style={styles.artwork} />
              <View style={styles.meta}>
                <Text style={styles.trackTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.trackArtist} numberOfLines={1}>
                  {item.artist}
                </Text>
              </View>
              <Text style={styles.playHint}>播放</Text>
            </Pressable>
          )}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  container: {
    flex: 1,
    paddingTop: 18,
    paddingHorizontal: 16,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  search: {
    marginTop: 14,
    height: 46,
    borderRadius: 14,
    paddingHorizontal: 14,
    color: "#FFFFFF",
    backgroundColor: "rgba(17,24,39,0.45)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.2)",
  },
  listContent: {
    paddingTop: 14,
    paddingBottom: 28,
    gap: 10,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.22)",
  },
  artwork: { width: 52, height: 52, borderRadius: 12 },
  meta: { flex: 1, marginLeft: 12 },
  trackTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  trackArtist: {
    marginTop: 3,
    color: "rgba(255,255,255,0.78)",
    fontSize: 13,
    fontWeight: "600",
  },
  playHint: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(37,99,235,0.8)",
  },
});
