import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MeScreen() {
  const router = useRouter();
  const appVersion = Constants.expoConfig?.version ?? "1.0.0";

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.screen}>
          <View style={styles.topBar}>
            <Text style={styles.title}>Me</Text>

            <Pressable
              style={styles.iconBtn}
              accessibilityRole="button"
              accessibilityLabel="Settings"
              onPress={() => router.push("/about")}
            >
              <MaterialIcons name="settings" color="#0B1220" size={20} />
            </Pressable>
          </View>

          <Text style={styles.subtitle}>Account, settings, and app info live here.</Text>

          <View style={styles.profileCard}>
            <View style={styles.profileRow}>
              <View style={styles.avatar} accessibilityRole="image" accessibilityLabel="Avatar">
                <Text style={styles.avatarText}>G</Text>
              </View>

              <View style={styles.profileMeta}>
                <Text style={styles.profileName}>Guest</Text>
                <Text style={styles.profileEmail}>guest@example.com</Text>
              </View>
            </View>

            <Pressable
              style={styles.profileAction}
              accessibilityRole="button"
              accessibilityLabel="Edit profile"
              onPress={() => router.push("/about")}
            >
              <MaterialIcons name="edit" color="#0B1220" size={16} />
              <Text style={styles.profileActionText}>Edit profile</Text>
            </Pressable>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionEyebrow}>Quick actions</Text>

            <View style={styles.listCard}>
              <Pressable
                style={styles.row}
                accessibilityRole="button"
                accessibilityLabel="Settings, Preferences and account"
                onPress={() => router.push("/about")}
              >
                <MaterialIcons name="tune" color="#7DD3FC" size={20} />
                <View style={styles.rowText}>
                  <Text style={styles.rowTitle}>Settings</Text>
                  <Text style={styles.rowHint}>Preferences & account</Text>
                </View>
                <MaterialIcons name="chevron-right" color="rgba(226,232,240,0.8)" size={20} />
              </Pressable>

              <View style={styles.divider} />

              <Pressable
                style={styles.row}
                accessibilityRole="button"
                accessibilityLabel="Privacy & Security, Control data and sessions"
                onPress={() => {
                  Alert.alert("Privacy & Security", "Coming soon.");
                }}
              >
                <MaterialIcons name="security" color="#7DD3FC" size={20} />
                <View style={styles.rowText}>
                  <Text style={styles.rowTitle}>Privacy & Security</Text>
                  <Text style={styles.rowHint}>Control data and sessions</Text>
                </View>
                <MaterialIcons name="chevron-right" color="rgba(226,232,240,0.8)" size={20} />
              </Pressable>

              <View style={styles.divider} />

              <Pressable
                style={styles.row}
                accessibilityRole="button"
                accessibilityLabel="Notifications, Listening reminders"
                onPress={() => {
                  Alert.alert("Notifications", "Coming soon.");
                }}
              >
                <MaterialIcons name="notifications" color="#7DD3FC" size={20} />
                <View style={styles.rowText}>
                  <Text style={styles.rowTitle}>Notifications</Text>
                  <Text style={styles.rowHint}>Listening reminders</Text>
                </View>
                <MaterialIcons name="chevron-right" color="rgba(226,232,240,0.8)" size={20} />
              </Pressable>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionEyebrow}>Help & info</Text>

            <View style={styles.listCard}>
              <Pressable
                style={styles.row}
                accessibilityRole="button"
                accessibilityLabel="Help & Support, FAQ and troubleshooting"
                onPress={() => {
                  Alert.alert("Help & Support", "Coming soon.");
                }}
              >
                <MaterialIcons name="help" color="#7DD3FC" size={20} />
                <View style={styles.rowText}>
                  <Text style={styles.rowTitle}>Help & Support</Text>
                  <Text style={styles.rowHint}>FAQ and troubleshooting</Text>
                </View>
                <MaterialIcons name="chevron-right" color="rgba(226,232,240,0.8)" size={20} />
              </Pressable>

              <View style={styles.divider} />

              <Pressable
                style={styles.row}
                accessibilityRole="button"
                accessibilityLabel="About, App info and version"
                onPress={() => router.push("/about")}
              >
                <MaterialIcons name="info" color="#7DD3FC" size={20} />
                <View style={styles.rowText}>
                  <Text style={styles.rowTitle}>About</Text>
                  <Text style={styles.rowHint}>App info & version</Text>
                </View>
                <MaterialIcons name="chevron-right" color="rgba(226,232,240,0.8)" size={20} />
              </Pressable>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionEyebrow}>Account</Text>

            <View style={styles.listCard}>
              <Pressable
                style={styles.row}
                accessibilityRole="button"
                accessibilityLabel="Log out, End this session"
                onPress={() => {
                  Alert.alert("Log out", "Demo app: no authentication connected.");
                }}
              >
                <MaterialIcons name="logout" color="#FB7185" size={20} />
                <View style={styles.rowText}>
                  <Text style={styles.rowTitle}>Log out</Text>
                  <Text style={styles.rowHint}>End this session</Text>
                </View>
                <MaterialIcons name="chevron-right" color="rgba(251,113,133,0.85)" size={20} />
              </Pressable>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Version {appVersion}</Text>
            <Text style={styles.footerHint}>Made for fast, focused listening.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#07111F",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 92,
    backgroundColor: "#07111F",
  },
  screen: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 4,
    backgroundColor: "#07111F",
  },
  title: {
    color: "#F8FAFC",
    fontSize: 26,
    fontWeight: "900",
  },
  subtitle: {
    marginTop: 4,
    color: "#94A3B8",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 6,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#38BDF8",
  },
  profileCard: {
    padding: 18,
    borderRadius: 28,
    backgroundColor: "rgba(15,23,42,0.72)",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.16)",
    marginTop: 8,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 999,
    backgroundColor: "rgba(56,189,248,0.14)",
    borderWidth: 1,
    borderColor: "rgba(125,211,252,0.26)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#7DD3FC",
    fontSize: 22,
    fontWeight: "900",
  },
  profileMeta: {
    flex: 1,
  },
  profileName: {
    color: "#F8FAFC",
    fontSize: 18,
    fontWeight: "900",
  },
  profileEmail: {
    marginTop: 6,
    color: "#94A3B8",
    fontSize: 13,
    fontWeight: "700",
  },
  profileAction: {
    marginTop: 14,
    height: 46,
    borderRadius: 18,
    backgroundColor: "#38BDF8",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  profileActionText: {
    color: "#0B1220",
    fontSize: 15,
    fontWeight: "900",
  },
  section: {
    marginTop: 18,
  },
  sectionEyebrow: {
    color: "#7DD3FC",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  listCard: {
    borderRadius: 26,
    backgroundColor: "rgba(12,18,31,0.92)",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.16)",
    overflow: "hidden",
  },
  row: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  rowText: {
    flex: 1,
    paddingRight: 8,
  },
  rowTitle: {
    color: "#F8FAFC",
    fontSize: 16,
    fontWeight: "900",
  },
  rowHint: {
    marginTop: 4,
    color: "#94A3B8",
    fontSize: 13,
    fontWeight: "700",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(148,163,184,0.16)",
  },
  footer: {
    marginTop: 18,
    paddingBottom: 14,
    paddingHorizontal: 4,
  },
  footerText: {
    color: "#94A3B8",
    fontSize: 13,
    fontWeight: "800",
  },
  footerHint: {
    marginTop: 6,
    color: "rgba(148,163,184,0.9)",
    fontSize: 12,
    fontWeight: "700",
  },
});
