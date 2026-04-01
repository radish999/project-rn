import { Image } from "expo-image";
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

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
    <ImageBackground
      source={require("@/assets/images/bg.jpg")}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <Stack.Screen
        options={{
          title: "播放器",
          headerStyle: { backgroundColor: "#0B1220" },
          headerTintColor: "#FFFFFF",
        }}
      />
      <View style={styles.container}>
        <View style={styles.topRow}>
          <Pressable style={styles.back} onPress={() => router.back()}>
            <Text style={styles.backText}>返回</Text>
          </Pressable>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {isBuffering ? "缓冲中" : isPlaying ? "播放中" : "已暂停"}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Image source={track.artwork} style={styles.artwork} />
          <Text style={styles.title} numberOfLines={1}>
            {track.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {track.artist}
          </Text>

          <Pressable
            style={styles.progressBar}
            onLayout={(e) => setBarWidth(e.nativeEvent.layout.width)}
            onPress={(e) => onPressBar(e.nativeEvent.locationX)}
          >
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
            <View style={[styles.progressDot, { left: `${progress * 100}%` }]} />
          </Pressable>

          <View style={styles.timeRow}>
            <Text style={styles.time}>{formatTime(positionMs)}</Text>
            <Text style={styles.time}>{formatTime(durationMs)}</Text>
          </View>

          <View style={styles.controlsRow}>
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
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 18 },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  back: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.22)",
  },
  backText: { color: "#FFFFFF", fontWeight: "800" },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(37,99,235,0.35)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.22)",
  },
  badgeText: { color: "#FFFFFF", fontWeight: "800" },
  card: {
    marginTop: 16,
    padding: 16,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.22)",
  },
  artwork: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  title: {
    marginTop: 14,
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
  },
  artist: {
    marginTop: 6,
    color: "rgba(255,255,255,0.78)",
    fontSize: 14,
    fontWeight: "700",
  },
  progressBar: {
    marginTop: 18,
    height: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.18)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "rgba(37,99,235,0.9)",
  },
  progressDot: {
    position: "absolute",
    top: -4,
    width: 18,
    height: 18,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    marginLeft: -9,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(0,0,0,0.18)",
  },
  timeRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  time: { color: "rgba(255,255,255,0.8)", fontWeight: "700" },
  controlsRow: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  smallBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.22)",
    alignItems: "center",
  },
  smallBtnText: { color: "#FFFFFF", fontWeight: "800", fontSize: 12 },
  playBtn: {
    flex: 1.2,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "rgba(37,99,235,0.9)",
    alignItems: "center",
  },
  playBtnText: { color: "#FFFFFF", fontWeight: "900" },
});
