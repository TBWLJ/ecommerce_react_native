import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/auth";

const baseMenuItems = [
  { id: "orders", title: "My Orders", icon: "time-outline" },
  { id: "address", title: "Address Book", icon: "location-outline" },
  { id: "history", title: "Purchase History", icon: "receipt-outline" },
  { id: "settings", title: "Settings", icon: "settings-outline" },
  { id: "share", title: "Share App", icon: "share-social-outline" },
] as const;

export default function ProfileScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);

  const menuItems = [
    ...baseMenuItems,
    ...(user?.role === "admin"
      ? [{ id: "admin", title: "Admin Tools", icon: "shield-checkmark-outline" }]
      : []),
  ];

  const goToLogin = () => {
    router.push({
      pathname: "/login",
      params: { redirectTo: "/profile" },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={22} color="#171717" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Profile</Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {!user ? (
          <View style={styles.authCard}>
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person-outline" size={32} color="#2B8F17" />
            </View>
            <Text style={styles.authTitle}>Sign in to manage your account</Text>
            <Text style={styles.authText}>
              Keep track of your cart, profile, and checkout details in one place.
            </Text>

            <TouchableOpacity style={styles.primaryButton} onPress={goToLogin}>
              <Text style={styles.primaryButtonText}>Sign in</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() =>
                router.push({ pathname: "/signup", params: { redirectTo: "/profile" } })
              }
            >
              <Text style={styles.secondaryButtonText}>Create account</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            </View>

            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.email}>{user.email}</Text>

            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>
                {user.role === "admin" ? "Administrator" : "Customer"}
              </Text>
            </View>

            <TouchableOpacity style={styles.editButton} activeOpacity={0.8}>
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              activeOpacity={0.75}
            >
              <View style={styles.menuLeft}>
                <Ionicons name={item.icon} size={20} color="#6B6B6B" />
                <Text style={styles.menuText}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#A0A0A0" />
            </TouchableOpacity>
          ))}
        </View>

        {user && (
          <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
            <Ionicons name="log-out-outline" size={18} color="#B04A4A" />
            <Text style={styles.logoutText}>Log out</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#171717",
  },
  headerSpacer: {
    width: 40,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  authCard: {
    marginHorizontal: 20,
    marginTop: 24,
    padding: 22,
    borderRadius: 22,
    backgroundColor: "#FAFAFA",
    alignItems: "center",
  },
  avatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#EAF5E4",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#D9E9D1",
  },
  authTitle: {
    marginTop: 18,
    fontSize: 20,
    fontWeight: "800",
    color: "#171717",
    textAlign: "center",
  },
  authText: {
    marginTop: 8,
    fontSize: 13,
    color: "#6C6C6C",
    textAlign: "center",
    lineHeight: 20,
  },
  primaryButton: {
    width: "100%",
    marginTop: 18,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#2B8F17",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  secondaryButton: {
    width: "100%",
    marginTop: 12,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  secondaryButtonText: {
    color: "#171717",
    fontSize: 15,
    fontWeight: "700",
  },
  profileSection: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 30,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: "#F5F5F5",
  },
  name: {
    fontSize: 22,
    fontWeight: "800",
    color: "#171717",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "#8B8B8B",
    marginBottom: 10,
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#EAF5E4",
    marginBottom: 18,
  },
  roleBadgeText: {
    fontSize: 12,
    color: "#2B8F17",
    fontWeight: "800",
  },
  editButton: {
    backgroundColor: "#2B8F17",
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 25,
  },
  editButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  menuContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FAFAFA",
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: "#E9E9E9",
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  menuText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
  },
  logoutButton: {
    marginHorizontal: 20,
    marginTop: 18,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#FFF6F6",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    borderWidth: 1,
    borderColor: "#F2DCDC",
  },
  logoutText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#B04A4A",
  },
});
