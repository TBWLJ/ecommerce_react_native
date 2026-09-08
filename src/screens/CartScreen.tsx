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
import { cartSummary, useCartStore } from "@/store/cart";
import { formatMoney } from "@/lib/money";

export default function CartScreen() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const { subtotal, shipping, total } = cartSummary(items);

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

        <Text style={styles.title}>Cart</Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>My cart list</Text>
          <Text style={styles.sectionMeta}>{items.length} items</Text>
        </View>

        {items.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="cart-outline" size={40} color="#8A8A8A" />
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptyText}>
              Add something from home or explore to get started.
            </Text>
            <TouchableOpacity
              style={styles.shopButton}
              onPress={() => router.push("/")}
            >
              <Text style={styles.shopButtonText}>Start shopping</Text>
            </TouchableOpacity>
          </View>
        ) : (
          items.map((item) => (
            <View key={item.id} style={styles.itemContainer}>
              <View style={styles.imageWrap}>
                <Image source={{ uri: item.image }} style={styles.productImage} />
              </View>

              <View style={styles.productDetails}>
                <Text style={styles.productName} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={styles.priceStyle}>{formatMoney(item.price)}</Text>

                <View style={styles.actionsRow}>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeItem(item.id)}
                  >
                    <Ionicons name="trash-outline" size={16} color="#B04A4A" />
                    <Text style={styles.removeText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  <Ionicons name="remove" size={18} color="#171717" />
                </TouchableOpacity>

                <View style={styles.quantityBox}>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                </View>

                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  <Ionicons name="add" size={18} color="#171717" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <View style={styles.bottomSection}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryPrice}>{formatMoney(subtotal)}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Shipping</Text>
          <Text style={styles.summaryPrice}>
            {shipping === 0 ? "Free" : formatMoney(shipping)}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalPrice}>{formatMoney(total)}</Text>
        </View>

        <TouchableOpacity
          style={[styles.checkoutButton, items.length === 0 && styles.disabledButton]}
          activeOpacity={0.85}
          disabled={items.length === 0}
          onPress={() => router.push("/checkout")}
        >
          <Text style={styles.checkoutText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 15,
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
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#171717",
  },
  headerSpacer: {
    width: 40,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  sectionTitleContainer: {
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#171717",
  },
  sectionMeta: {
    fontSize: 12,
    color: "#8A8A8A",
    fontWeight: "600",
  },
  emptyState: {
    marginHorizontal: 20,
    marginTop: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 24,
    alignItems: "center",
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#171717",
  },
  emptyText: {
    fontSize: 13,
    color: "#666666",
    textAlign: "center",
  },
  shopButton: {
    marginTop: 8,
    backgroundColor: "#2B8F17",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  shopButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
  itemContainer: {
    marginHorizontal: 20,
    marginTop: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  imageWrap: {
    backgroundColor: "#F5F5F5",
    width: 88,
    height: 88,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  productDetails: {
    flex: 1,
    marginLeft: 12,
    gap: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#171717",
  },
  priceStyle: {
    color: "#7A7A7A",
    fontSize: 15,
    fontWeight: "600",
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  removeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  removeText: {
    fontSize: 12,
    color: "#B04A4A",
    fontWeight: "700",
  },
  quantityContainer: {
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: "#F3F3F3",
    alignItems: "center",
    justifyContent: "center",
  },
  quantityBox: {
    backgroundColor: "#2B8F17",
    minWidth: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  quantityText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  bottomSection: {
    marginTop: "auto",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 5,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  summaryLabel: {
    fontSize: 15,
    color: "#777777",
    fontWeight: "600",
  },
  summaryPrice: {
    fontSize: 15,
    fontWeight: "700",
    color: "#171717",
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: "800",
    color: "#171717",
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: "800",
    color: "#171717",
  },
  checkoutButton: {
    height: 55,
    backgroundColor: "#2B8F17",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  disabledButton: {
    opacity: 0.45,
  },
  checkoutText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
});
