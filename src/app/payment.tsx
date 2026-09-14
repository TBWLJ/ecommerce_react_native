import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { WebView } from "react-native-webview";
import {
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useCartStore } from "@/store/cart";

export default function PaymentScreen() {
  const router = useRouter();
  const clearCart = useCartStore((state) => state.clearCart);
  const params = useLocalSearchParams<{
    paymentUrl?: string | string[];
    orderId?: string | string[];
  }>();
  const paymentUrl = typeof params.paymentUrl === "string" ? params.paymentUrl : "";
  const orderId = typeof params.orderId === "string" ? params.orderId : "";
  const [completed, setCompleted] = useState(false);
  const [failed, setFailed] = useState(false);

  const handleNavigation = (url: string) => {
    const normalizedUrl = url.toLowerCase();
    const isComplete =
      normalizedUrl.includes("/checkout/complete") ||
      normalizedUrl.includes("payment=success") ||
      normalizedUrl.includes("status=success");

    if (isComplete && !completed) {
      clearCart();
      setCompleted(true);
    }
  };

  if (completed) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.centerState}>
          <View style={styles.successIcon}>
            <Text style={styles.checkmark}>✓</Text>
          </View>
          <Text style={styles.title}>Payment completed</Text>
          <Text style={styles.message}>
            Order {orderId || "confirmed"} has been submitted successfully.
          </Text>
          <TouchableOpacity style={styles.button} onPress={() => router.replace("/")}>
            <Text style={styles.buttonText}>Back to home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!paymentUrl) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerState}>
          <Text style={styles.title}>Payment unavailable</Text>
          <Text style={styles.message}>We could not open the payment page.</Text>
          <TouchableOpacity style={styles.button} onPress={() => router.back()}>
            <Text style={styles.buttonText}>Return to checkout</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Secure payment</Text>
        <View style={styles.headerSpacer} />
      </View>
      <WebView
        source={{ uri: paymentUrl }}
        onNavigationStateChange={(navigation) => handleNavigation(navigation.url)}
        onError={() => setFailed(true)}
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#2B8F17" />
            <Text style={styles.loadingText}>Loading secure payment...</Text>
          </View>
        )}
      />
      {failed && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>Unable to load the payment page.</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    height: 58,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F6F6F6",
    alignItems: "center",
    justifyContent: "center",
  },
  backText: { fontSize: 30, lineHeight: 32, color: "#171717" },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#171717" },
  headerSpacer: { width: 38 },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  loadingText: { marginTop: 12, color: "#666666", fontSize: 14 },
  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  successIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#2B8F17",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  checkmark: { color: "#FFFFFF", fontSize: 34, fontWeight: "800" },
  title: { fontSize: 23, fontWeight: "800", color: "#171717", textAlign: "center" },
  message: {
    marginTop: 10,
    color: "#666666",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },
  button: {
    marginTop: 24,
    minWidth: 190,
    height: 52,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: "#2B8F17",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "800" },
  errorBanner: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#FFF0F0",
  },
  errorText: { color: "#B04A4A", textAlign: "center", fontWeight: "700" },
});
