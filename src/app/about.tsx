import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { KNOWLEDGE_PLATFORM_URL } from "@/src/config/knowledge-platform";

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.title}>关于当前 App</Text>
          <Text style={styles.text}>
            这个项目已经从原先的音乐应用改造成知识平台移动端容器，主要职责是加载并展示现有的 Web 版知识平台。
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>改造原则</Text>
          <Text style={styles.text}>1. 不改动 knowledge-platform 的 PC 端站点结构。</Text>
          <Text style={styles.text}>2. RN 端只承担壳层、导航和移动端展示。</Text>
          <Text style={styles.text}>3. 域名可配置，后续替换线上地址成本很低。</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>当前加载地址</Text>
          <Text style={styles.url}>{KNOWLEDGE_PLATFORM_URL}</Text>
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
    gap: 16,
  },
  card: {
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    padding: 20,
    gap: 10,
  },
  title: {
    color: "#0F172A",
    fontSize: 26,
    fontWeight: "800",
  },
  sectionTitle: {
    color: "#0F172A",
    fontSize: 18,
    fontWeight: "700",
  },
  text: {
    color: "#475569",
    fontSize: 14,
    lineHeight: 22,
  },
  url: {
    color: "#0F766E",
    fontSize: 14,
    fontWeight: "700",
  },
});
