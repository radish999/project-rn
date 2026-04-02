import { Stack } from "expo-router";

import { PlaybackProvider } from "@/src/providers/playback-provider";

export default function RootLayout() {
  return (
    <PlaybackProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#0B1220" },
          headerTintColor: "#FFFFFF",
        }}
      >
        <Stack.Screen name="index" options={{ title: "Library" }} />
        <Stack.Screen name="player" options={{ title: "Player" }} />
      </Stack>
    </PlaybackProvider>
  );
}
