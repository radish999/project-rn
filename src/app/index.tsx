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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View style={styles.screen}>
        <View style={styles.glowTop} />
        <View style={styles.glowBottom} />

        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View>
              <View style={styles.heroCard}>
                <View style={styles.heroTag}>
                  <Text style={styles.heroTagText}>今日聆听</Text>
                </View>
                <Text style={styles.heroTitle}>发现更舒服的听歌方式</Text>
                <Text style={styles.heroSubtitle}>
                  简洁曲库、即时搜索、点开就播。把注意力留给音乐本身。
                </Text>

                <View style={styles.heroStats}>
                  <View style={styles.statCard}>
                    <Text style={styles.statValue}>{tracks.length}</Text>
                    <Text style={styles.statLabel}>首曲目</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statCard}>
                    <Text style={styles.statValue}>{data.length}</Text>
                    <Text style={styles.statLabel}>搜索结果</Text>
                  </View>
                </View>
              </View>

              <View style={styles.sectionHeader}>
                <View>
                  <Text style={styles.sectionEyebrow}>曲库</Text>
                  <Text style={styles.sectionTitle}>快速找到想听的歌</Text>
                </View>
              </View>

              <View style={styles.searchShell}>
                <Text style={styles.searchIcon}>◎</Text>
                <TextInput
                  value={query}
                  onChangeText={setQuery}
                  placeholder="搜索歌名 / 歌手"
                  placeholderTextColor="#6B7280"
                  style={styles.search}
                />
              </View>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>没有找到匹配结果</Text>
              <Text style={styles.emptyText}>换个关键词试试，比如歌名或歌手名。</Text>
            </View>
          }
          renderItem={({ item, index }) => (
            <Pressable
              style={[styles.item, index === 0 && styles.itemFeatured]}
              onPress={() =>
                router.push({ pathname: "./player", params: { id: item.id } })
              }
            >
              <View style={styles.itemIndex}>
                <Text style={styles.itemIndexText}>{String(index + 1).padStart(2, "0")}</Text>
              </View>

              <Image source={item.artwork} style={styles.artwork} contentFit="cover" />

              <View style={styles.meta}>
                <Text style={styles.trackTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.trackArtist} numberOfLines={1}>
                  {item.artist}
                </Text>
                <Text style={styles.trackDesc} numberOfLines={1}>
                  点击进入沉浸式播放页
                </Text>
              </View>

              <View style={styles.playPill}>
                <Text style={styles.playPillText}>播放</Text>
              </View>
            </Pressable>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#07111F",
  },
  screen: {
    flex: 1,
    backgroundColor: "#07111F",
  },
  glowTop: {
    position: "absolute",
    top: -120,
    right: -40,
    width: 260,
    height: 260,
    borderRadius: 260,
    backgroundColor: "rgba(56,189,248,0.18)",
  },
  glowBottom: {
    position: "absolute",
    bottom: -100,
    left: -80,
    width: 280,
    height: 280,
    borderRadius: 280,
    backgroundColor: "rgba(244,114,182,0.14)",
  },
  listContent: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 28,
    gap: 12,
  },
  heroCard: {
    padding: 22,
    borderRadius: 28,
    backgroundColor: "#0E1A2B",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.18)",
    shadowColor: "#020617",
    shadowOpacity: 0.28,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
  heroTag: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#15314F",
  },
  heroTagText: {
    color: "#7DD3FC",
    fontSize: 12,
    fontWeight: "700",
  },
  heroTitle: {
    marginTop: 16,
    color: "#F8FAFC",
    fontSize: 31,
    lineHeight: 38,
    fontWeight: "900",
  },
  heroSubtitle: {
    marginTop: 10,
    color: "#94A3B8",
    fontSize: 15,
    lineHeight: 23,
    fontWeight: "500",
  },
  heroStats: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 22,
    backgroundColor: "#0A1424",
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  statCard: {
    flex: 1,
  },
  statValue: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
  },
  statLabel: {
    marginTop: 4,
    color: "#94A3B8",
    fontSize: 12,
    fontWeight: "600",
  },
  statDivider: {
    width: 1,
    alignSelf: "stretch",
    marginHorizontal: 12,
    backgroundColor: "rgba(148,163,184,0.18)",
  },
  sectionHeader: {
    marginTop: 22,
    marginBottom: 12,
  },
  sectionEyebrow: {
    color: "#7DD3FC",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  sectionTitle: {
    marginTop: 6,
    color: "#F8FAFC",
    fontSize: 24,
    fontWeight: "800",
  },
  searchShell: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  searchIcon: {
    marginRight: 10,
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "700",
  },
  search: {
    flex: 1,
    color: "#0F172A",
    fontSize: 17,
    fontWeight: "600",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 24,
    backgroundColor: "rgba(15,23,42,0.88)",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.16)",
  },
  itemFeatured: {
    backgroundColor: "rgba(17, 33, 58, 0.98)",
    borderColor: "rgba(125,211,252,0.22)",
  },
  itemIndex: {
    width: 38,
    alignItems: "center",
    justifyContent: "center",
  },
  itemIndexText: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "800",
  },
  artwork: {
    width: 62,
    height: 62,
    borderRadius: 18,
    backgroundColor: "#102033",
  },
  meta: {
    flex: 1,
    marginLeft: 14,
    marginRight: 10,
  },
  trackTitle: {
    color: "#F8FAFC",
    fontSize: 19,
    fontWeight: "800",
  },
  trackArtist: {
    marginTop: 4,
    color: "#CBD5E1",
    fontSize: 14,
    fontWeight: "700",
  },
  trackDesc: {
    marginTop: 6,
    color: "#64748B",
    fontSize: 12,
    fontWeight: "600",
  },
  playPill: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#38BDF8",
  },
  playPillText: {
    color: "#062033",
    fontSize: 13,
    fontWeight: "900",
  },
  emptyCard: {
    marginTop: 8,
    padding: 20,
    borderRadius: 22,
    backgroundColor: "rgba(15,23,42,0.72)",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.16)",
  },
  emptyTitle: {
    color: "#F8FAFC",
    fontSize: 18,
    fontWeight: "800",
  },
  emptyText: {
    marginTop: 8,
    color: "#94A3B8",
    fontSize: 14,
    lineHeight: 21,
  },
});
