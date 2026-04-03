import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTracks } from "@/src/hooks/use-tracks";
import { usePlayback } from "@/src/providers/playback-provider";
export default function FlashListeningScreen() {
  const previewMs = 30000;
  const [previewMode, setPreviewMode] = useState(true);
  const [seed, setSeed] = useState(0);
  const { tracks, isLoading, error } = useTracks("", "featured");
  const playback = usePlayback();

  const currentId = playback.currentTrack?.id ?? null;
  const isPlaying = playback.isPlaying;
  const isBuffering = playback.isBuffering;
  const playNextRef = useRef(playback.playNext);
  const selectTrackRef = useRef(playback.selectTrack);

  useEffect(() => {
    playNextRef.current = playback.playNext;
    selectTrackRef.current = playback.selectTrack;
  }, [playback.playNext, playback.selectTrack]);

  const createRng = (initialSeed: number) => {
    let a = initialSeed | 0;
    return () => {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };

  const queue = useMemo(() => {
    if (!tracks.length) return [];
    const copy = [...tracks];
    const rng = createRng(seed + 1);
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rng() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, 20);
  }, [tracks, seed]);

  useEffect(() => {
    if (!queue.length) return;

    const stillInQueue = currentId ? queue.some((t) => t.id === currentId) : false;
    if (stillInQueue) return;

    selectTrackRef.current(queue[0].id, queue);
  }, [currentId, queue]);

  const autoNextRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoNextTrackIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (autoNextRef.current) {
      clearTimeout(autoNextRef.current);
      autoNextRef.current = null;
    }

    if (!previewMode || !currentId || !isPlaying) {
      autoNextTrackIdRef.current = null;
      return;
    }

    if (autoNextTrackIdRef.current === currentId) return;
    autoNextTrackIdRef.current = currentId;

    autoNextRef.current = setTimeout(() => {
      autoNextTrackIdRef.current = null;
      playNextRef.current();
    }, previewMs);

    return () => {
      if (autoNextRef.current) {
        clearTimeout(autoNextRef.current);
        autoNextRef.current = null;
      }
    };
  }, [currentId, isPlaying, previewMode, previewMs]);

  const current = playback.currentTrack;
  const durationMs = playback.durationMs;
  const positionMs = playback.positionMs;
  const effectiveDuration = previewMode
    ? Math.min(durationMs || previewMs, previewMs)
    : durationMs;
  const progress = effectiveDuration ? Math.min(1, positionMs / effectiveDuration) : 0;
  const remainingMs = previewMode ? Math.max(0, previewMs - positionMs) : 0;
  const remainingSec = Math.ceil(remainingMs / 1000);

  return (
    <SafeAreaView style={styles.safeArea} edges={["left", "right"]}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Text style={styles.modeHint}>
            {previewMode ? "Preview • 30s" : "Full playback"}
          </Text>
          <View style={styles.headerActions}>
            <Pressable
              style={[styles.chip, previewMode && styles.chipActive]}
              onPress={() => setPreviewMode(!previewMode)}
            >
              <MaterialIcons
                name={previewMode ? "timer" : "timer-off"}
                color={previewMode ? "#0B1220" : "#E2E8F0"}
                size={18}
              />
              <Text style={[styles.chipText, previewMode && styles.chipTextActive]}>
                {previewMode ? "Preview" : "Full"}
              </Text>
            </Pressable>
            <Pressable style={styles.iconBtn} onPress={() => setSeed((v) => v + 1)}>
              <MaterialIcons name="refresh" color="#E2E8F0" size={20} />
            </Pressable>
          </View>
        </View>

        {isLoading || error ? (
          <View style={styles.notice}>
            <Text style={styles.noticeTitle}>{isLoading ? "Loading playlist..." : "Load failed"}</Text>
            <Text style={styles.noticeText}>
              {isLoading ? "Preparing tracks for quick preview. Please wait." : error}
            </Text>
          </View>
        ) : null}

        <View style={styles.card}>
          <View style={styles.artworkWrap}>
            {current ? (
              <Image source={current.artwork} style={styles.artwork} contentFit="cover" />
            ) : (
              <View style={styles.artworkPlaceholder}>
                <MaterialIcons name="music-note" color="#7DD3FC" size={64} />
              </View>
            )}
          </View>

          <View style={styles.meta}>
            <Text style={styles.trackTitle} numberOfLines={1}>
              {current?.title ?? "No track selected"}
            </Text>
            <Text style={styles.trackArtist} numberOfLines={1}>
              {current?.artist ?? "Pick a track to start listening"}
            </Text>
          </View>

          <View style={styles.progressShell}>
            <View style={styles.progressTrack} />
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
            <View style={[styles.progressDot, { left: `${progress * 100}%` }]} />
          </View>

          <View style={styles.statusRow}>
            <Text style={styles.statusText}>
              {isBuffering
                ? "Buffering..."
                : isPlaying
                  ? "Playing"
                  : current
                    ? "Paused"
                    : "Not playing"}
            </Text>
            {previewMode && current ? (
              <Text style={styles.statusHint}>Next track in {remainingSec}s</Text>
            ) : (
              <Text style={styles.statusHint}>{queue.length ? `${queue.length} in queue` : "No queue"}</Text>
            )}
          </View>

          <View style={styles.controlsRow}>
            <Pressable
              style={[styles.smallBtn, !queue.length && styles.btnDisabled]}
              onPress={() => playback.playPrevious()}
              disabled={!queue.length}
            >
              <MaterialIcons name="skip-previous" color="#E2E8F0" size={22} />
            </Pressable>
            <Pressable
              style={[styles.playBtn, !current && styles.btnDisabled]}
              onPress={() => playback.togglePlay()}
              disabled={!current}
            >
              <MaterialIcons
                name={playback.isPlaying ? "pause" : "play-arrow"}
                color="#062033"
                size={30}
              />
            </Pressable>
            <Pressable
              style={[styles.smallBtn, !queue.length && styles.btnDisabled]}
              onPress={() => playback.playNext()}
              disabled={!queue.length}
            >
              <MaterialIcons name="skip-next" color="#E2E8F0" size={22} />
            </Pressable>
          </View>
        </View>

        <View style={styles.queueCard}>
          <View style={styles.queueTop}>
            <Text style={styles.queueTitle}>Up next</Text>
            <Text style={styles.queueCount}>{queue.length} tracks</Text>
          </View>
          <Text style={styles.queueText} numberOfLines={3}>
            {queue.slice(0, 5).map((t) => `${t.title} · ${t.artist}`).join("  /  ")}
          </Text>
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
    paddingHorizontal: 18,
    paddingTop: 8,
    backgroundColor: "#07111F",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  modeHint: {
    color: "#94A3B8",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.16)",
  },
  chipActive: {
    backgroundColor: "#38BDF8",
    borderColor: "rgba(56,189,248,0.2)",
  },
  chipText: {
    color: "#E2E8F0",
    fontSize: 12,
    fontWeight: "800",
  },
  chipTextActive: {
    color: "#0B1220",
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.16)",
  },
  notice: {
    marginTop: 12,
    padding: 16,
    borderRadius: 18,
    backgroundColor: "rgba(15,23,42,0.88)",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.14)",
  },
  noticeTitle: {
    color: "#F8FAFC",
    fontSize: 14,
    fontWeight: "900",
  },
  noticeText: {
    marginTop: 6,
    color: "#94A3B8",
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "600",
  },
  card: {
    marginTop: 14,
    padding: 18,
    borderRadius: 28,
    backgroundColor: "rgba(12,18,31,0.92)",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.16)",
  },
  artworkWrap: {
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  artwork: {
    width: "100%",
    aspectRatio: 1,
  },
  artworkPlaceholder: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#0A1424",
    alignItems: "center",
    justifyContent: "center",
  },
  meta: {
    marginTop: 16,
  },
  trackTitle: {
    color: "#F8FAFC",
    fontSize: 20,
    fontWeight: "900",
  },
  trackArtist: {
    marginTop: 6,
    color: "#CBD5E1",
    fontSize: 14,
    fontWeight: "700",
  },
  progressShell: {
    marginTop: 18,
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
  statusRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusText: {
    color: "#E2E8F0",
    fontSize: 13,
    fontWeight: "800",
  },
  statusHint: {
    color: "#7DD3FC",
    fontSize: 12,
    fontWeight: "800",
  },
  controlsRow: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  smallBtn: {
    flex: 1,
    height: 54,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.14)",
  },
  playBtn: {
    flex: 1.2,
    height: 54,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#38BDF8",
  },
  btnDisabled: {
    opacity: 0.55,
  },
  queueCard: {
    marginTop: 14,
    padding: 16,
    borderRadius: 22,
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
    fontSize: 16,
    fontWeight: "900",
  },
  queueCount: {
    color: "#7DD3FC",
    fontSize: 12,
    fontWeight: "900",
  },
  queueText: {
    marginTop: 10,
    color: "#94A3B8",
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "600",
  },
});
