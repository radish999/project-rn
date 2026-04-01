import { Image } from "expo-image";
import { startTransition, useState } from "react";
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

import { useTracks } from "@/src/hooks/use-tracks";

export default function Index() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const { error, isLoading, source, tracks } = useTracks(query);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View style={styles.screen}>
        <View style={styles.glowTop} />
        <View style={styles.glowBottom} />

        <FlatList
          data={tracks}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View>
              <View style={styles.heroCard}>
                <View style={styles.heroOrbLarge} />
                <View style={styles.heroOrbSmall} />
                <View style={styles.heroTag}>
                  <Text style={styles.heroTagText}>编辑推荐</Text>
                </View>
                <Text style={styles.heroKicker}>For You</Text>
                <Text style={styles.heroTitle}>把曲库变成一张有呼吸感的首页</Text>
                <Text style={styles.heroSubtitle}>
                  更像 Apple Music 的精选感，也保留 Spotify 那种直接、顺手、随点随播的效率。
                </Text>

                <View style={styles.heroStats}>
                  <View style={styles.statCard}>
                    <Text style={styles.statValue}>{tracks.length}</Text>
                    <Text style={styles.statLabel}>首曲目</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statCard}>
                    <Text style={styles.statValue}>
                      {source === "jamendo" ? "Live" : "Demo"}
                    </Text>
                    <Text style={styles.statLabel}>歌单来源</Text>
                  </View>
                </View>

                <View style={styles.heroFeatureRow}>
                  <View style={styles.featureCard}>
                    <Text style={styles.featureLabel}>Mood</Text>
                    <Text style={styles.featureValue}>Late Night</Text>
                  </View>
                  <View style={styles.featureCard}>
                    <Text style={styles.featureLabel}>Focus</Text>
                    <Text style={styles.featureValue}>Deep Listening</Text>
                  </View>
                </View>
              </View>

              <View style={styles.sectionHeader}>
                <View>
                  <Text style={styles.sectionEyebrow}>曲库</Text>
                  <Text style={styles.sectionTitle}>快速找到想听的歌</Text>
                </View>
              </View>

              <View style={styles.chipRow}>
                <View style={[styles.chip, styles.chipActive]}>
                  <Text style={[styles.chipText, styles.chipTextActive]}>精选</Text>
                </View>
                <View style={styles.chip}>
                  <Text style={styles.chipText}>流行</Text>
                </View>
                <View style={styles.chip}>
                  <Text style={styles.chipText}>电子</Text>
                </View>
                <View style={styles.chip}>
                  <Text style={styles.chipText}>夜间</Text>
                </View>
              </View>

              <View style={styles.searchShell}>
                <Text style={styles.searchIcon}>◎</Text>
                <TextInput
                  value={query}
                  onChangeText={(value) => {
                    startTransition(() => setQuery(value));
                  }}
                  placeholder="搜索歌名 / 歌手"
                  placeholderTextColor="#6B7280"
                  style={styles.search}
                />
              </View>

              {(isLoading || error) && (
                <View style={styles.infoCard}>
                  <Text style={styles.infoTitle}>
                    {isLoading ? "正在从 Jamendo 加载歌单..." : "歌单状态"}
                  </Text>
                  <Text style={styles.infoText}>
                    {isLoading
                      ? "正在获取在线曲目与封面，请稍候。"
                      : error}
                  </Text>
                </View>
              )}
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

              <View style={styles.artworkShell}>
                <Image source={item.artwork} style={styles.artwork} contentFit="cover" />
              </View>

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
                <Text style={styles.playPillText}>▶</Text>
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
    overflow: "hidden",
    padding: 22,
    borderRadius: 32,
    backgroundColor: "#101826",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.18)",
    shadowColor: "#020617",
    shadowOpacity: 0.28,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
  heroOrbLarge: {
    position: "absolute",
    top: -40,
    right: -20,
    width: 180,
    height: 180,
    borderRadius: 180,
    backgroundColor: "rgba(56,189,248,0.18)",
  },
  heroOrbSmall: {
    position: "absolute",
    bottom: -30,
    right: 70,
    width: 110,
    height: 110,
    borderRadius: 110,
    backgroundColor: "rgba(167,139,250,0.14)",
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
  heroKicker: {
    marginTop: 18,
    color: "#E2E8F0",
    fontSize: 14,
    fontWeight: "700",
    opacity: 0.8,
  },
  heroTitle: {
    marginTop: 8,
    color: "#F8FAFC",
    fontSize: 34,
    lineHeight: 40,
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
  heroFeatureRow: {
    marginTop: 14,
    flexDirection: "row",
    gap: 10,
  },
  featureCard: {
    flex: 1,
    padding: 14,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  featureLabel: {
    color: "#94A3B8",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  featureValue: {
    marginTop: 6,
    color: "#F8FAFC",
    fontSize: 16,
    fontWeight: "800",
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
  chipRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: "rgba(15,23,42,0.9)",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.14)",
  },
  chipActive: {
    backgroundColor: "#F8FAFC",
  },
  chipText: {
    color: "#CBD5E1",
    fontSize: 13,
    fontWeight: "700",
  },
  chipTextActive: {
    color: "#0F172A",
  },
  searchShell: {
    height: 58,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderRadius: 22,
    backgroundColor: "rgba(248,250,252,0.96)",
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
    borderRadius: 26,
    backgroundColor: "rgba(12,18,31,0.92)",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.16)",
  },
  itemFeatured: {
    backgroundColor: "rgba(17, 30, 51, 0.98)",
    borderColor: "rgba(125,211,252,0.28)",
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
  artworkShell: {
    padding: 3,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  artwork: {
    width: 62,
    height: 62,
    borderRadius: 19,
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
    width: 42,
    height: 42,
    borderRadius: 999,
    backgroundColor: "#38BDF8",
    alignItems: "center",
    justifyContent: "center",
  },
  playPillText: {
    color: "#062033",
    fontSize: 14,
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
  infoCard: {
    marginTop: 12,
    padding: 16,
    borderRadius: 18,
    backgroundColor: "rgba(15,23,42,0.88)",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.14)",
  },
  infoTitle: {
    color: "#F8FAFC",
    fontSize: 14,
    fontWeight: "800",
  },
  infoText: {
    marginTop: 6,
    color: "#94A3B8",
    fontSize: 13,
    lineHeight: 20,
  },
});
