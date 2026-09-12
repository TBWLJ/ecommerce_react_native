import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
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
import { cartSummary, useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { formatMoney } from "@/lib/money";
import { createOrder } from "@/services/orders";

const paymentMethods = [
  { id: "card", label: "Card" },
  { id: "transfer", label: "Transfer" },
  { id: "cash", label: "Cash on delivery" },
] as const;

export default function CheckoutScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const { subtotal, shipping, total } = useMemo(
    () => cartSummary(items),
    [items]
  );

  const [fullName, setFullName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<(typeof paymentMethods)[number]["id"]>("card");
  const [error, setError] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    if (user?.name && !fullName) {
      setFullName(user.name);
    }
  }, [fullName, user?.name]);

  const goToAuth = (pathname: "/login" | "/signup") => {
    router.push({
      pathname,
      params: { redirectTo: "/checkout" },
    });
  };

  const handlePlaceOrder = async () => {
    if (!user || !token) {
      setError("Please sign in before checking out.");
      return;
    }

    if (!items.length) {
      setError("Your cart is empty.");
      return;
    }

    if (!fullName.trim() || !phone.trim() || !address.trim() || !city.trim()) {
      setError("Please complete the delivery details.");
      return;
    }

    try {
      setPlacingOrder(true);
      setError("");
      const nextOrderId = await createOrder(
        {
          items,
          fullName,
          phone,
          address,
          city,
          note,
          paymentMethod,
          subtotal,
          shipping,
          total,
        },
        token
      );
      setOrderId(nextOrderId || "confirmed");
      setOrderPlaced(true);
      clearCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to place order.");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.authState}>
          <Ionicons name="lock-closed-outline" size={42} color="#2B8F17" />
          <Text style={styles.authTitle}>Sign in to checkout</Text>
          <Text style={styles.authText}>
            Your cart is ready, but checkout needs an account so we can save your order.
          </Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => goToAuth("/login")}>
            <Text style={styles.primaryButtonText}>Sign in</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => goToAuth("/signup")}>
            <Text style={styles.secondaryButtonText}>Create account</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.authState}>
          <Ionicons name="cart-outline" size={42} color="#2B8F17" />
          <Text style={styles.authTitle}>Your cart is empty</Text>
          <Text style={styles.authText}>
            Add a few products first, then come back here to complete your order.
          </Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => router.push("/")}>
            <Text style={styles.primaryButtonText}>Start shopping</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push("/cart")}
          >
            <Text style={styles.secondaryButtonText}>Review cart</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (orderPlaced) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.successState}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark" size={28} color="#FFFFFF" />
          </View>
          <Text style={styles.successTitle}>Order placed successfully</Text>
          <Text style={styles.successText}>
            Your order {orderId} is confirmed. We’ll keep the details ready in your account.
          </Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => router.replace("/")}>
            <Text style={styles.primaryButtonText}>Back to home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={22} color="#171717" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Checkout</Text>

            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Items</Text>
              <Text style={styles.summaryValue}>{items.length}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{formatMoney(subtotal)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping</Text>
              <Text style={styles.summaryValue}>
                {shipping === 0 ? "Free" : formatMoney(shipping)}
              </Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatMoney(total)}</Text>
            </View>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>Delivery details</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full name</Text>
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="Recipient name"
                placeholderTextColor="#999999"
                style={styles.input}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone number</Text>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="080..."
                placeholderTextColor="#999999"
                keyboardType="phone-pad"
                style={styles.input}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Delivery address</Text>
              <TextInput
                value={address}
                onChangeText={setAddress}
                placeholder="Street, house number, landmark"
                placeholderTextColor="#999999"
                multiline
                style={[styles.input, styles.textArea]}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>City</Text>
              <TextInput
                value={city}
                onChangeText={setCity}
                placeholder="Lagos"
                placeholderTextColor="#999999"
                style={styles.input}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Note for rider</Text>
              <TextInput
                value={note}
                onChangeText={setNote}
                placeholder="Apartment number, delivery hints..."
                placeholderTextColor="#999999"
                multiline
                style={[styles.input, styles.textArea]}
              />
            </View>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>Payment method</Text>
            <View style={styles.paymentRow}>
              {paymentMethods.map((method) => {
                const active = paymentMethod === method.id;
                return (
                  <TouchableOpacity
                    key={method.id}
                    style={[styles.paymentChip, active && styles.paymentChipActive]}
                    onPress={() => setPaymentMethod(method.id)}
                  >
                    <Text
                      style={[
                        styles.paymentChipText,
                        active && styles.paymentChipTextActive,
                      ]}
                    >
                      {method.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {!!error && <Text style={styles.errorText}>{error}</Text>}

          <View style={styles.itemsCard}>
            <Text style={styles.sectionTitle}>Items in your order</Text>
            {items.map((item) => (
              <View key={item.id} style={styles.itemRow}>
                <Text style={styles.itemName} numberOfLines={1}>
                  {item.quantity} x {item.name}
                </Text>
                <Text style={styles.itemPrice}>
                  {formatMoney(item.price * item.quantity)}
                </Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handlePlaceOrder}
            disabled={placingOrder}
          >
            <Text style={styles.primaryButtonText}>
              {placingOrder ? "Placing order..." : "Place order"}
            </Text>
          </TouchableOpacity>

          <View style={{ height: 28 }} />
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
    paddingBottom: 24,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#F6F6F6",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#171717",
  },
  headerSpacer: {
    width: 42,
  },
  summaryCard: {
    marginHorizontal: 20,
    marginTop: 18,
    padding: 18,
    borderRadius: 22,
    backgroundColor: "#FAFAFA",
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#6E6E6E",
    fontWeight: "600",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "800",
    color: "#171717",
  },
  totalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
    marginTop: 6,
    borderTopWidth: 1,
    borderTopColor: "#E7E7E7",
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "800",
    color: "#171717",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#171717",
  },
  formCard: {
    marginHorizontal: 20,
    marginTop: 16,
    padding: 18,
    borderRadius: 22,
    backgroundColor: "#FAFAFA",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#171717",
    marginBottom: 14,
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
  input: {
    minHeight: 52,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E7E7E7",
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#171717",
    textAlignVertical: "top",
  },
  textArea: {
    minHeight: 90,
    paddingTop: 14,
  },
  paymentRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  paymentChip: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E7E7E7",
  },
  paymentChipActive: {
    backgroundColor: "#2B8F17",
    borderColor: "#2B8F17",
  },
  paymentChipText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#4B4B4B",
  },
  paymentChipTextActive: {
    color: "#FFFFFF",
  },
  errorText: {
    marginHorizontal: 20,
    marginTop: 12,
    fontSize: 13,
    color: "#B04A4A",
    fontWeight: "600",
  },
  itemsCard: {
    marginHorizontal: 20,
    marginTop: 16,
    padding: 18,
    borderRadius: 22,
    backgroundColor: "#FAFAFA",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 10,
  },
  itemName: {
    flex: 1,
    fontSize: 13,
    color: "#555555",
    fontWeight: "600",
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: "800",
    color: "#171717",
  },
  primaryButton: {
    marginHorizontal: 20,
    marginTop: 18,
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
  secondaryButton: {
    marginHorizontal: 20,
    marginTop: 12,
    height: 54,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: "#171717",
    fontSize: 15,
    fontWeight: "700",
  },
  authState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 10,
  },
  authTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#171717",
    textAlign: "center",
    marginTop: 8,
  },
  authText: {
    fontSize: 13,
    lineHeight: 20,
    color: "#666666",
    textAlign: "center",
    marginBottom: 8,
  },
  successState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 10,
  },
  successIcon: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "#2B8F17",
    alignItems: "center",
    justifyContent: "center",
  },
  successTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#171717",
    textAlign: "center",
    marginTop: 8,
  },
  successText: {
    fontSize: 13,
    lineHeight: 20,
    color: "#666666",
    textAlign: "center",
    marginBottom: 8,
  },
});
