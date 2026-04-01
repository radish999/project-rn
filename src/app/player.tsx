import { Image } from "expo-image";
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getTrackIndexById, tracks } from "@/src/lib/tracks";

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

  const initialIndex = useMemo(() => {
    const id = typeof params.id === "string" ? params.id : undefined;
    return id ? getTrackIndexById(id) : 0;
  }, [params.id]);

  const [index, setIndex] = useState(initialIndex);
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    setIndex(initialIndex);
  }, [initialIndex]);

  const track = tracks[index] ?? tracks[0];
  const player = useAudioPlayer(track?.url ?? null, {
    updateInterval: 450,
    downloadFirst: true,
  });
  const status = useAudioPlayerStatus(player);
  const isPlaying = status.playing;
  const isBuffering = status.isBuffering;
  const positionMs = Math.floor((status.currentTime ?? 0) * 1000);
  const durationMs = Math.floor((status.duration ?? 0) * 1000);

  useEffect(() => {
    setAudioModeAsync({
      allowsRecording: false,
      shouldPlayInBackground: false,
      playsInSilentMode: true,
      interruptionMode: "doNotMix",
      shouldRouteThroughEarpiece: false,
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (status.isLoaded) {
      player.play();
    }
  }, [player, status.isLoaded]);

  useEffect(() => {
    if (status.didJustFinish) {
      setIndex((prev) => (prev + 1) % tracks.length);
    }
  }, [status.didJustFinish]);

  const togglePlay = async () => {
    try {
      if (isPlaying) {
        player.pause();
      } else {
        player.play();
      }
    } catch {}
  };

  const seekToFraction = async (fraction: number) => {
    if (!durationMs) return;
    const clamped = Math.max(0, Math.min(1, fraction));
    const next = Math.floor(durationMs * clamped);
    try {
      await player.seekTo(next / 1000);
    } catch {}
  };

  const jumpByMs = async (delta: number) => {
    if (!durationMs) return;
    const next = Math.max(0, Math.min(durationMs, positionMs + delta));
    try {
      await player.seekTo(next / 1000);
    } catch {}
  };

  const onPressBar = async (x: number) => {
    if (!barWidth) return;
    await seekToFraction(x / barWidth);
  };

  const progress = durationMs ? positionMs / durationMs : 0;

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
              <Text style={styles.badgeText}>
                {isBuffering ? "缓冲中" : isPlaying ? "正在播放" : "已暂停"}
              </Text>
            </View>
          </View>

          <View style={styles.heroCard}>
            <Image source={track.artwork} style={styles.artwork} contentFit="contain" />

            <View style={styles.trackBlock}>
              <Text style={styles.eyebrow}>Now Playing</Text>
              <Text style={styles.title} numberOfLines={1}>
                {track.title}
              </Text>
              <Text style={styles.artist} numberOfLines={1}>
                {track.artist}
              </Text>
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
              <Pressable
                style={styles.smallBtn}
                onPress={() => setIndex((prev) => (prev - 1 + tracks.length) % tracks.length)}
              >
                <Text style={styles.smallBtnText}>上一首</Text>
              </Pressable>
              <Pressable style={styles.playBtn} onPress={togglePlay}>
                <Text style={styles.playBtnText}>{isPlaying ? "暂停" : "播放"}</Text>
              </Pressable>
              <Pressable
                style={styles.smallBtn}
                onPress={() => setIndex((prev) => (prev + 1) % tracks.length)}
              >
                <Text style={styles.smallBtnText}>下一首</Text>
              </Pressable>
              <Pressable style={styles.smallBtn} onPress={() => jumpByMs(15000)}>
                <Text style={styles.smallBtnText}>+15s</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.queueCard}>
            <Text style={styles.queueTitle}>播放建议</Text>
            <Text style={styles.queueText}>
              当前第 {index + 1} 首，共 {tracks.length} 首。播放结束后会自动切到下一首。
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
    marginTop: 18,
    padding: 18,
    borderRadius: 30,
    backgroundColor: "#0E1A2B",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.18)",
    shadowColor: "#020617",
    shadowOpacity: 0.3,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
  artwork: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 26,
    backgroundColor: "#13253A",
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
    fontSize: 30,
    fontWeight: "900",
  },
  artist: {
    marginTop: 8,
    color: "#CBD5E1",
    fontSize: 16,
    fontWeight: "700",
  },
  progressShell: {
    marginTop: 22,
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
    borderRadius: 16,
    backgroundColor: "#111F33",
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
    paddingVertical: 14,
    borderRadius: 18,
    backgroundColor: "#38BDF8",
    alignItems: "center",
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
  queueTitle: {
    color: "#F8FAFC",
    fontSize: 18,
    fontWeight: "800",
  },
  queueText: {
    marginTop: 8,
    color: "#94A3B8",
    fontSize: 14,
    lineHeight: 22,
  },
});
