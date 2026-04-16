import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { KNOWLEDGE_PLATFORM_URL } from "@/src/config/knowledge-platform";

export default function MeScreen() {
  const router = useRouter();
  const appVersion = Constants.expoConfig?.version ?? "1.0.0";

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>知识平台</Text>
          <Text style={styles.heroSubtitle}>移动端容器版</Text>
          <Text style={styles.heroText}>
            当前 App 通过 WebView 承载已有知识平台站点，PC 端和 Web 端代码保持独立演进。
          </Text>
        </View>

        <View style={styles.listCard}>
          <View style={styles.row}>
            <MaterialIcons name="language" color="#0F766E" size={20} />
            <View style={styles.rowBody}>
              <Text style={styles.rowTitle}>站点地址</Text>
              <Text style={styles.rowHint}>{KNOWLEDGE_PLATFORM_URL}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Pressable style={styles.row} onPress={() => router.push("/about")}>
            <MaterialIcons name="info-outline" color="#0F766E" size={20} />
            <View style={styles.rowBody}>
              <Text style={styles.rowTitle}>关于应用</Text>
              <Text style={styles.rowHint}>查看当前容器化改造说明</Text>
            </View>
            <MaterialIcons name="chevron-right" color="#94A3B8" size={20} />
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Version {appVersion}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F7F2",
  },
  content: {
    padding: 20,
    gap: 18,
  },
  hero: {
    borderRadius: 28,
    backgroundColor: "#0F766E",
    padding: 22,
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
  },
  heroSubtitle: {
    marginTop: 4,
    color: "rgba(255,255,255,0.88)",
    fontSize: 16,
    fontWeight: "700",
  },
  heroText: {
    marginTop: 12,
    color: "rgba(255,255,255,0.84)",
    fontSize: 14,
    lineHeight: 22,
  },
  listCard: {
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 18,
  },
  rowBody: {
    flex: 1,
  },
  rowTitle: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "700",
  },
  rowHint: {
    marginTop: 4,
    color: "#64748B",
    fontSize: 13,
    lineHeight: 20,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(15,23,42,0.08)",
  },
  footer: {
    alignItems: "center",
    paddingVertical: 8,
  },
  footerText: {
    color: "#64748B",
    fontSize: 13,
    fontWeight: "600",
  },
});
