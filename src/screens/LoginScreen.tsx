import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "@/store/auth";

const resolveRedirect = (value: string | string[] | undefined) =>
  typeof value === "string" && value.startsWith("/") ? value : "/";

export default function LoginScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ redirectTo?: string | string[] }>();
  const redirectTo = resolveRedirect(params.redirectTo);
  const signIn = useAuthStore((state) => state.signIn);
  const user = useAuthStore((state) => state.user);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.replace(redirectTo);
    }
  }, [redirectTo, router, user]);

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      signIn({ email, password });
      router.replace(redirectTo);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topRow}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={22} color="#171717" />
            </TouchableOpacity>
          </View>

          <View style={styles.hero}>
            <Text style={styles.label}>Welcome back</Text>
            <Text style={styles.title}>Sign in to your store account</Text>
            <Text style={styles.subtitle}>
              Pick up where you left off, keep your cart in sync, and check out faster.
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email address</Text>
              <View style={styles.inputWrap}>
                <Ionicons name="mail-outline" size={18} color="#8A8A8A" />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  placeholderTextColor="#999999"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  style={styles.input}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputWrap}>
                <Ionicons name="lock-closed-outline" size={18} color="#8A8A8A" />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Your password"
                  placeholderTextColor="#999999"
                  secureTextEntry
                  style={styles.input}
                />
              </View>
            </View>

            {!!error && <Text style={styles.errorText}>{error}</Text>}

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.primaryButtonText}>
                {loading ? "Signing in..." : "Sign in"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.linkButton}
              onPress={() =>
                router.push({ pathname: "/signup", params: { redirectTo } })
              }
            >
              <Text style={styles.linkText}>Create a new account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 28,
  },
  topRow: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#F6F6F6",
    alignItems: "center",
    justifyContent: "center",
  },
  hero: {
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  label: {
    fontSize: 13,
    color: "#2B8F17",
    fontWeight: "800",
    marginBottom: 8,
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "800",
    color: "#171717",
  },
  subtitle: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 22,
    color: "#666666",
  },
  card: {
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 22,
    padding: 18,
    backgroundColor: "#FAFAFA",
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#171717",
    marginBottom: 8,
  },
  inputWrap: {
    height: 52,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E7E7E7",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#171717",
  },
  errorText: {
    marginTop: 2,
    marginBottom: 10,
    fontSize: 13,
    color: "#B04A4A",
    fontWeight: "600",
  },
  primaryButton: {
    marginTop: 6,
    height: 54,
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
  linkButton: {
    marginTop: 14,
    alignItems: "center",
  },
  linkText: {
    color: "#171717",
    fontSize: 13,
    fontWeight: "700",
  },
});
