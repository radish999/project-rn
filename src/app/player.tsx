import { Image } from "expo-image";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTracks } from "@/src/hooks/use-tracks";
import { usePlayback } from "@/src/providers/playback-provider";

function formatTime(ms: number) {
  if (!Number.isFinite(ms) || ms < 0) return "0:00";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function PlayerScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const { error, isLoading, source, tracks } = useTracks("", "featured");
  const [barWidth, setBarWidth] = useState(0);
  const {
    currentIndex,
    currentTrack,
    durationMs,
    hasQueue,
    isBuffering,
    isLoaded,
    isPlaying,
    jumpByMs,
    playNext,
    playPrevious,
    positionMs,
    queue,
    seekToFraction,
    selectTrack,
    togglePlay,
  } = usePlayback();

  useEffect(() => {
    const id = typeof params.id === "string" ? params.id : undefined;
    if (!id || !tracks.length) return;

    const hasRequestedTrack = queue.some((track) => track.id === id);
    if (!hasRequestedTrack) {
      selectTrack(id, tracks);
    } else if (!currentTrack || currentTrack.id !== id) {
      selectTrack(id);
    }
  }, [currentTrack, params.id, queue, selectTrack, tracks]);

  const onPressBar = async (x: number) => {
    if (!barWidth) return;
    await seekToFraction(x / barWidth);
  };

  const progress = durationMs ? positionMs / durationMs : 0;
  const track = currentTrack;
  const isTrackReady = Boolean(track && isLoaded);
  const statusText = isLoading
    ? "正在准备播放"
    : isBuffering
      ? "缓冲中"
      : isPlaying
        ? "正在播放"
        : isTrackReady
          ? "已暂停"
          : "暂无可播放曲目";

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View style={styles.screen}>
        <View style={styles.glowTop} />
        <View style={styles.glowBottom} />

        <Stack.Screen
          options={{
            title: "播放器",
            headerStyle: { backgroundColor: "#07111F" },
            headerTintColor: "#F8FAFC",
          }}
        />

        <View style={styles.container}>
          <View style={styles.topRow}>
            <Pressable style={styles.back} onPress={() => router.back()}>
              <Text style={styles.backText}>返回曲库</Text>
            </Pressable>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{statusText}</Text>
            </View>
          </View>

          <View style={styles.heroCard}>
            <View style={styles.heroHalo} />
            <View style={styles.artworkShell}>
              {track ? (
                <Image source={track.artwork} style={styles.artwork} contentFit="contain" />
              ) : (
                <View style={styles.artworkPlaceholder}>
                  <Text style={styles.artworkPlaceholderText}>♪</Text>
                </View>
              )}
            </View>

            <View style={styles.trackBlock}>
              <Text style={styles.eyebrow}>Now Playing</Text>
              <Text style={styles.title} numberOfLines={1}>
                {track?.title ?? (isLoading ? "正在加载歌曲..." : "未找到可播放歌曲")}
              </Text>
              <Text style={styles.artist} numberOfLines={1}>
                {track?.artist ?? (isLoading ? "请稍候" : "请返回曲库重新选择")}
              </Text>
              <Text style={styles.albumMeta}>精选歌单 · 无损氛围感试听</Text>
            </View>

            <Pressable
              style={styles.progressShell}
              onLayout={(e) => setBarWidth(e.nativeEvent.layout.width)}
              onPress={(e) => onPressBar(e.nativeEvent.locationX)}
            >
              <View style={styles.progressTrack} />
              <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
              <View style={[styles.progressDot, { left: `${progress * 100}%` }]} />
            </Pressable>

            <View style={styles.timeRow}>
              <Text style={styles.time}>{formatTime(positionMs)}</Text>
              <Text style={styles.time}>{formatTime(durationMs)}</Text>
            </View>

            <View style={styles.playbackPanel}>
              <Pressable style={styles.smallBtn} onPress={() => jumpByMs(-15000)}>
                <Text style={styles.smallBtnText}>-15s</Text>
              </Pressable>
              <Pressable style={styles.smallBtn} onPress={playPrevious}>
                <Text style={styles.smallBtnText}>上一首</Text>
              </Pressable>
              <Pressable
                style={[styles.playBtn, !isTrackReady && styles.disabledBtn]}
                onPress={togglePlay}
                disabled={!isTrackReady}
              >
                <Text style={styles.playBtnText}>
                  {isLoading ? "加载中" : isPlaying ? "暂停" : "播放"}
                </Text>
              </Pressable>
              <Pressable style={styles.smallBtn} onPress={playNext}>
                <Text style={styles.smallBtnText}>下一首</Text>
              </Pressable>
              <Pressable style={styles.smallBtn} onPress={() => jumpByMs(15000)}>
                <Text style={styles.smallBtnText}>+15s</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.queueCard}>
            <View style={styles.queueTop}>
              <Text style={styles.queueTitle}>接下来播放</Text>
              <Text style={styles.queueCount}>
                {hasQueue ? currentIndex + 1 : 0}/{queue.length}
              </Text>
            </View>
            <Text style={styles.queueText}>播放结束后会自动切到下一首，适合连续试听整组曲目。</Text>
            {error && <Text style={styles.queueHint}>{error}</Text>}
            <Text style={styles.queueHint}>
              当前来源：{source === "jamendo" ? "Jamendo 在线歌单" : "本地示例歌单"}
            </Text>
          </View>
        </View>
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
    top: -100,
    right: -40,
    width: 260,
    height: 260,
    borderRadius: 260,
    backgroundColor: "rgba(34,197,94,0.12)",
  },
  glowBottom: {
    position: "absolute",
    bottom: -120,
    left: -60,
    width: 300,
    height: 300,
    borderRadius: 300,
    backgroundColor: "rgba(56,189,248,0.14)",
  },
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 24,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  back: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "rgba(15,23,42,0.9)",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.16)",
  },
  backText: {
    color: "#E2E8F0",
    fontWeight: "800",
  },
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#12263E",
    borderWidth: 1,
    borderColor: "rgba(125,211,252,0.24)",
  },
  badgeText: {
    color: "#7DD3FC",
    fontWeight: "800",
  },
  heroCard: {
    overflow: "hidden",
    marginTop: 18,
    padding: 20,
    borderRadius: 34,
    backgroundColor: "#101826",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.18)",
    shadowColor: "#020617",
    shadowOpacity: 0.3,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
  heroHalo: {
    position: "absolute",
    top: -35,
    right: -20,
    width: 190,
    height: 190,
    borderRadius: 190,
    backgroundColor: "rgba(56,189,248,0.14)",
  },
  artworkShell: {
    padding: 10,
    borderRadius: 34,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  artwork: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 28,
    backgroundColor: "#13253A",
  },
  artworkPlaceholder: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 28,
    backgroundColor: "#13253A",
    alignItems: "center",
    justifyContent: "center",
  },
  artworkPlaceholderText: {
    color: "#7DD3FC",
    fontSize: 68,
    fontWeight: "300",
  },
  trackBlock: {
    marginTop: 18,
  },
  eyebrow: {
    color: "#7DD3FC",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  title: {
    marginTop: 10,
    color: "#F8FAFC",
    fontSize: 32,
    fontWeight: "900",
  },
  artist: {
    marginTop: 8,
    color: "#CBD5E1",
    fontSize: 16,
    fontWeight: "700",
  },
  albumMeta: {
    marginTop: 8,
    color: "#64748B",
    fontSize: 13,
    fontWeight: "600",
  },
  progressShell: {
    marginTop: 24,
    justifyContent: "center",
    height: 22,
  },
  progressTrack: {
    position: "absolute",
    width: "100%",
    height: 8,
    borderRadius: 999,
    backgroundColor: "rgba(148,163,184,0.18)",
  },
  progressFill: {
    position: "absolute",
    height: 8,
    borderRadius: 999,
    backgroundColor: "#38BDF8",
  },
  progressDot: {
    position: "absolute",
    top: 1,
    width: 20,
    height: 20,
    borderRadius: 999,
    marginLeft: -10,
    backgroundColor: "#F8FAFC",
    borderWidth: 3,
    borderColor: "#0E1A2B",
  },
  timeRow: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  time: {
    color: "#94A3B8",
    fontWeight: "700",
  },
  playbackPanel: {
    marginTop: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  smallBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.14)",
    alignItems: "center",
  },
  smallBtnText: {
    color: "#E2E8F0",
    fontWeight: "800",
    fontSize: 12,
  },
  playBtn: {
    flex: 1.2,
    paddingVertical: 15,
    borderRadius: 22,
    backgroundColor: "#38BDF8",
    alignItems: "center",
  },
  disabledBtn: {
    opacity: 0.6,
  },
  playBtnText: {
    color: "#062033",
    fontWeight: "900",
    fontSize: 14,
  },
  queueCard: {
    marginTop: 16,
    padding: 18,
    borderRadius: 24,
    backgroundColor: "rgba(15,23,42,0.82)",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.16)",
  },
  queueTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  queueTitle: {
    color: "#F8FAFC",
    fontSize: 18,
    fontWeight: "800",
  },
  queueCount: {
    color: "#7DD3FC",
    fontSize: 13,
    fontWeight: "800",
  },
  queueText: {
    marginTop: 8,
    color: "#94A3B8",
    fontSize: 14,
    lineHeight: 22,
  },
  queueHint: {
    marginTop: 8,
    color: "#64748B",
    fontSize: 12,
    lineHeight: 18,
  },
});
