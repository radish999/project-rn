import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View style={styles.screen}>
        <View style={styles.card}>
          <Text style={styles.title}>Me</Text>
          <Text style={styles.subtitle}>Account, settings, and app info live here.</Text>
        </View>

        <Pressable style={styles.item} onPress={() => router.push("/about")}>
          <Text style={styles.itemText}>About</Text>
          <Text style={styles.itemHint}>›</Text>
        </Pressable>
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
    paddingTop: 14,
    backgroundColor: "#07111F",
  },
  card: {
    padding: 18,
    borderRadius: 26,
    backgroundColor: "rgba(15,23,42,0.72)",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.16)",
  },
  title: {
    color: "#F8FAFC",
    fontSize: 24,
    fontWeight: "900",
  },
  subtitle: {
    marginTop: 10,
    color: "#94A3B8",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
  },
  item: {
    marginTop: 14,
    padding: 16,
    borderRadius: 22,
    backgroundColor: "rgba(12,18,31,0.92)",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.16)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemText: {
    color: "#F8FAFC",
    fontSize: 16,
    fontWeight: "800",
  },
  itemHint: {
    color: "rgba(148,163,184,0.9)",
    fontSize: 18,
    fontWeight: "900",
  },
});
