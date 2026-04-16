import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#F5F7F2" },
        headerTintColor: "#0F172A",
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="about" options={{ title: "关于", headerBackTitle: "返回" }} />
    </Stack>
  );
}
