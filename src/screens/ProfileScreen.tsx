import Ionicons from "@expo/vector-icons/build/Ionicons";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

const menuItems = [
  { id: 1, title: "My Orders", icon: "time-outline" },
  { id: 2, title: "Address", icon: "time-outline" },
  { id: 3, title: "Payment Method", icon: "time-outline" },
  { id: 4, title: "Purchase History", icon: "time-outline" },
  { id: 5, title: "Setting", icon: "time-outline" },
  { id: 6, title: "Share", icon: "time-outline" },
  { id: 7, title: "LogOut", icon: "time-outline" },
];

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={22} color="#171717" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="camera" size={28} color="#23890d" />
            </View>
          </View>

          <Text style={styles.name}>Liam William</Text>
          <Text style={styles.email}>liamwilliam@gmail.com</Text>

          <TouchableOpacity style={styles.editButton} activeOpacity={0.8}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              activeOpacity={0.7}
            >
              <View style={styles.menuLeft}>
                <Ionicons name={item.icon} size={20} color="#A0A0A0" />
                <Text style={styles.menuText}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#A0A0A0" />
            </TouchableOpacity>
          ))}
        </View>
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
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  scrollContent: {
    paddingBottom: 30,
  },

  /* Profile Section */
  profileSection: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 30,
  },

  avatarContainer: {
    marginBottom: 16,
  },

  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },

  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#171717",
    marginBottom: 4,
  },

  email: {
    fontSize: 14,
    color: "#A0A0A0",
    marginBottom: 18,
  },

  editButton: {
    backgroundColor: "#23890d",
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 25,
  },

  editButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },

  /* Menu Items */
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
    borderWidth: 1.5,
    borderColor: "#23890d",
  },

  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  menuText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333333",
  },
});