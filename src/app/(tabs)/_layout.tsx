import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: "#0B1220" },
        headerTintColor: "#FFFFFF",
        tabBarStyle: { backgroundColor: "#0B1220", borderTopColor: "rgba(255,255,255,0.08)" },
        tabBarActiveTintColor: "#38BDF8",
        tabBarInactiveTintColor: "rgba(255,255,255,0.65)",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" color={color} size={size ?? 22} />
          ),
        }}
      />
      <Tabs.Screen
        name="flashListening"
        options={{
          title: "Flash Listening",
          tabBarLabel: "Flash Listening",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="music-note" color={color} size={size ?? 22} />
          ),
        }}
      />
      <Tabs.Screen
        name="user"
        options={{
          headerShown: false,
          title: "Me",
          tabBarLabel: "Me",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" color={color} size={size ?? 22} />
          ),
        }}
      />
    </Tabs>
  );
}
