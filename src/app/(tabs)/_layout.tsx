import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: "none" },
        tabBarActiveTintColor: "#0F766E",
        tabBarInactiveTintColor: "rgba(15,23,42,0.55)",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "知识平台",
          tabBarLabel: "首页",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="article" color={color} size={size ?? 22} />
          ),
        }}
      />
      <Tabs.Screen
        name="user"
        options={{
          headerShown: false,
          title: "我的",
          tabBarLabel: "我的",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" color={color} size={size ?? 22} />
          ),
        }}
      />
    </Tabs>
  );
}
