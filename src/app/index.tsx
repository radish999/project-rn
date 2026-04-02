import { Image } from "expo-image";
import { startTransition, useEffect, useRef, useState } from "react";
import { useRouter } from "expo-router";
import {
  Animated,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTracks } from "@/src/hooks/use-tracks";
import type { TrackCategory } from "@/src/lib/tracks";
import { usePlayback } from "@/src/providers/playback-provider";

const categoryTabs: Array<{ key: TrackCategory; label: string }> = [
  { key: "featured", label: "Featured" },
  { key: "pop", label: "Pop" },
  { key: "electronic", label: "Electronic" },
  { key: "night", label: "Night" },
];

function CategoryChip({
  active,
  label,
  onPress,
}: {
  active: boolean;
  label: string;
  onPress: () => void;
}) {
  const animated = useRef(new Animated.Value(active ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(animated, {
      toValue: active ? 1 : 0,
      friction: 8,
      tension: 80,
      useNativeDriver: false,
    }).start();
  }, [active, animated]);

  const animatedStyle = {
    backgroundColor: animated.interpolate({
      inputRange: [0, 1],
      outputRange: ["rgba(15,23,42,0.9)", "#F8FAFC"],
    }),
    borderColor: animated.interpolate({
      inputRange: [0, 1],
      outputRange: ["rgba(148,163,184,0.14)", "rgba(255,255,255,0.94)"],
    }),
    transform: [
      {
        scale: animated.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.04],
        }),
      },
      {
        translateY: animated.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -2],
        }),
      },
    ],
  };

  return (
    <Pressable onPress={onPress}>
      <Animated.View style={[styles.chip, animatedStyle]}>
        <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

function LoadingFooter({
  hasMore,
  isLoadingMore,
}: {
  hasMore: boolean;
  isLoadingMore: boolean;
}) {
  const pulse = useRef(new Animated.Value(0.65)).current;

  useEffect(() => {
    if (!isLoadingMore) {
      pulse.stopAnimation();
      pulse.setValue(0.65);
      return;
    }

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 680,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.65,
          duration: 680,
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();
    return () => loop.stop();
  }, [isLoadingMore, pulse]);

  return (
    <View style={styles.footerWrap}>
      <View style={[styles.footerCard, !isLoadingMore && styles.footerCardIdle]}>
        <View style={styles.footerIndicatorRow}>
          <Animated.View
            style={[
              styles.footerIndicator,
              isLoadingMore ? styles.footerIndicatorActive : styles.footerIndicatorIdle,
              { opacity: pulse, transform: [{ scale: pulse }] },
            ]}
          />
          <Text style={styles.footerTitle}>
            {isLoadingMore
              ? "Loading more tracks"
              : hasMore
                ? "Keep scrolling for the next page"
                : "You're all caught up"}
          </Text>
        </View>
        <Text style={styles.footerText}>
          {isLoadingMore
            ? "Jamendo is fetching another batch right now."
            : hasMore
              ? "More songs will load automatically near the bottom."
              : "There are no more songs to load in this category."}
        </Text>
      </View>
    </View>
  );
}

export default function Index() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<TrackCategory>("featured");
  const { error, hasMore, isLoading, isLoadingMore, loadMore, source, tracks } =
    useTracks(query, activeCategory);
  const { currentTrack, isPlaying, selectTrack } = usePlayback();

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
          onEndReached={loadMore}
          onEndReachedThreshold={0.45}
          ListHeaderComponent={
            <View>
              <View style={styles.heroCard}>
                <View style={styles.heroOrbLarge} />
                <View style={styles.heroOrbSmall} />
                <View style={styles.heroTag}>
                  <Text style={styles.heroTagText}>Editor&apos;s Pick</Text>
                </View>
                <Text style={styles.heroKicker}>For You</Text>
                <Text style={styles.heroTitle}>Turn the library into a living music home</Text>
                <Text style={styles.heroSubtitle}>
                  A home screen shaped with Apple Music polish and Spotify-style speed for instant listening.
                </Text>

                <View style={styles.heroStats}>
                  <View style={styles.statCard}>
                    <Text style={styles.statValue}>{tracks.length}</Text>
                    <Text style={styles.statLabel}>Tracks</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statCard}>
                    <Text style={styles.statValue}>
                      {source === "jamendo" ? "Live" : "Demo"}
                    </Text>
                    <Text style={styles.statLabel}>Source</Text>
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
                  <Text style={styles.sectionEyebrow}>Library</Text>
                  <Text style={styles.sectionTitle}>Find something worth replaying</Text>
                </View>
              </View>

              <View style={styles.chipRow}>
                {categoryTabs.map((tab) => {
                  return (
                    <CategoryChip
                      key={tab.key}
                      active={tab.key === activeCategory}
                      label={tab.label}
                      onPress={() => setActiveCategory(tab.key)}
                    />
                  );
                })}
              </View>

              <View style={styles.searchShell}>
                <Text style={styles.searchIcon}>◎</Text>
                <TextInput
                  value={query}
                  onChangeText={(value) => {
                    startTransition(() => setQuery(value));
                  }}
                  placeholder="Search songs or artists"
                  placeholderTextColor="#6B7280"
                  style={styles.search}
                />
              </View>

              {(isLoading || error) && (
                <View style={styles.infoCard}>
                  <Text style={styles.infoTitle}>
                    {isLoading ? "Loading playlist from Jamendo..." : "Playlist status"}
                  </Text>
                  <Text style={styles.infoText}>
                    {isLoading
                      ? "Fetching online tracks and artwork. Please wait."
                      : error}
                  </Text>
                </View>
              )}
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>No results found</Text>
              <Text style={styles.emptyText}>Try another keyword, song title, or artist name.</Text>
            </View>
          }
          ListFooterComponent={
            tracks.length > 0 ? (
              <LoadingFooter hasMore={hasMore} isLoadingMore={isLoadingMore} />
            ) : null
          }
          renderItem={({ item, index }) => (
            <Pressable
              style={[styles.item, index === 0 && styles.itemFeatured]}
              onPress={() => {
                selectTrack(item.id, tracks);
                router.push({ pathname: "./player", params: { id: item.id } });
              }}
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
                  Open the immersive player view
                </Text>
              </View>

              <View style={styles.playPill}>
                <Text style={styles.playPillText}>▶</Text>
              </View>
            </Pressable>
          )}
        />

        {currentTrack && (
          <Pressable
            style={styles.miniPlayer}
            onPress={() =>
              router.push({ pathname: "./player", params: { id: currentTrack.id } })
            }
          >
            <View style={styles.miniPlayerMeta}>
              <Text style={styles.miniPlayerEyebrow}>Now Playing</Text>
              <Text style={styles.miniPlayerTitle} numberOfLines={1}>
                {currentTrack.title}
              </Text>
              <Text style={styles.miniPlayerArtist} numberOfLines={1}>
                {currentTrack.artist}
              </Text>
            </View>
            <View style={styles.miniPlayerBadge}>
              <Text style={styles.miniPlayerBadgeText}>{isPlaying ? "Playing" : "Paused"}</Text>
            </View>
          </Pressable>
        )}
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
    paddingBottom: 120,
    gap: 12,
  },
  miniPlayer: {
    position: "absolute",
    left: 18,
    right: 18,
    bottom: 18,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: "rgba(7,17,31,0.94)",
    borderWidth: 1,
    borderColor: "rgba(125,211,252,0.2)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#020617",
    shadowOpacity: 0.28,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  miniPlayerMeta: {
    flex: 1,
    paddingRight: 12,
  },
  miniPlayerEyebrow: {
    color: "#7DD3FC",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  miniPlayerTitle: {
    color: "#F8FAFC",
    fontSize: 16,
    fontWeight: "800",
    marginTop: 6,
  },
  miniPlayerArtist: {
    color: "#94A3B8",
    fontSize: 13,
    marginTop: 4,
  },
  miniPlayerBadge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "rgba(56,189,248,0.14)",
    borderWidth: 1,
    borderColor: "rgba(125,211,252,0.25)",
  },
  miniPlayerBadgeText: {
    color: "#BAE6FD",
    fontSize: 12,
    fontWeight: "700",
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
    borderWidth: 1,
    shadowColor: "#020617",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
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
  footerCard: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 18,
    backgroundColor: "rgba(9,16,30,0.78)",
    borderWidth: 1,
    borderColor: "rgba(125,211,252,0.16)",
  },
  footerWrap: {
    paddingTop: 8,
    paddingBottom: 4,
  },
  footerCardIdle: {
    backgroundColor: "rgba(10,18,36,0.58)",
    borderColor: "rgba(148,163,184,0.12)",
  },
  footerIndicatorRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerIndicator: {
    width: 8,
    height: 8,
    borderRadius: 999,
    marginRight: 10,
  },
  footerIndicatorActive: {
    backgroundColor: "#38BDF8",
    shadowColor: "#38BDF8",
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  footerIndicatorIdle: {
    backgroundColor: "#64748B",
  },
  footerTitle: {
    color: "#E2E8F0",
    fontSize: 13,
    fontWeight: "800",
  },
  footerText: {
    marginTop: 8,
    color: "#94A3B8",
    fontSize: 12,
    lineHeight: 18,
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
