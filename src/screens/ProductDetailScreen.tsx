import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { useProduct } from "@/hooks/useProduct";
import { useCartStore } from "@/store/cart";
import { formatMoney } from "@/lib/money";

export default function ProductDetailScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const productId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { data: product, isLoading, isError } = useProduct(productId);
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#2B8F17" />
          <Text style={styles.loadingText}>Loading product...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#171717" />
          </TouchableOpacity>
        </View>

        <View style={styles.center}>
          <Ionicons name="alert-circle-outline" size={44} color="#999999" />
          <Text style={styles.errorText}>Unable to load this product.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleAddToCart = () => {
    addItem(product, quantity);
    router.push("/cart");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.image }}
            style={styles.image}
            resizeMode="cover"
          />

          <View style={styles.priceBadge}>
            <Text style={styles.priceBadgeText}>
              {formatMoney(product.price)}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.backButtonOverlay}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={22} color="#171717" />
          </TouchableOpacity>
        </View>

        <View style={styles.info}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.brand}>by {product.brand || product.category}</Text>

          <View style={styles.metaRow}>
            <Ionicons name="star" size={18} color="#F5A623" />
            <Text style={styles.metaText}>
              {product.rating ?? "4.8"} rating
            </Text>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.metaText}>{product.reviews} reviews</Text>
          </View>

          <Text style={styles.descriptionTitle}>Description</Text>
          <Text style={styles.description}>
            {product.description ||
              "Carefully curated product details, set up for fast browsing and a clean checkout flow."}
          </Text>

          <View style={styles.quantityRow}>
            <Text style={styles.quantityTitle}>Quantity</Text>

            <View style={styles.stepper}>
              <TouchableOpacity
                style={styles.stepperButton}
                onPress={() => setQuantity((value) => Math.max(1, value - 1))}
              >
                <Ionicons name="remove" size={18} color="#171717" />
              </TouchableOpacity>

              <View style={styles.quantityValue}>
                <Text style={styles.quantityText}>{quantity}</Text>
              </View>

              <TouchableOpacity
                style={styles.stepperButton}
                onPress={() => setQuantity((value) => value + 1)}
              >
                <Ionicons name="add" size={18} color="#171717" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <View>
            <Text style={styles.footerLabel}>Total</Text>
            <Text style={styles.footerPrice}>
              {formatMoney(product.price * quantity)}
            </Text>
          </View>

          <TouchableOpacity style={styles.cartButton} onPress={handleAddToCart}>
            <Text style={styles.cartButtonText}>Add to cart</Text>
          </TouchableOpacity>
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
  content: {
    paddingBottom: 24,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 10,
  },
  loadingText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#666666",
  },
  errorText: {
    fontSize: 15,
    color: "#666666",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#F6F6F6",
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    width: "100%",
    height: 420,
    backgroundColor: "#F5F5F5",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  priceBadge: {
    position: "absolute",
    top: 18,
    right: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  priceBadgeText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#171717",
  },
  backButtonOverlay: {
    position: "absolute",
    top: 18,
    left: 18,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  info: {
    paddingHorizontal: 24,
    paddingTop: 28,
  },
  name: {
    fontSize: 26,
    fontWeight: "800",
    color: "#171717",
    lineHeight: 32,
  },
  brand: {
    marginTop: 6,
    fontSize: 14,
    color: "#9E9E9E",
    fontWeight: "500",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
    gap: 6,
    flexWrap: "wrap",
  },
  metaText: {
    fontSize: 13,
    color: "#555555",
    fontWeight: "600",
  },
  metaDot: {
    color: "#B5B5B5",
    fontSize: 13,
  },
  descriptionTitle: {
    marginTop: 28,
    fontSize: 16,
    fontWeight: "800",
    color: "#171717",
  },
  description: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 22,
    color: "#757575",
  },
  quantityRow: {
    marginTop: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  quantityTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#171717",
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  stepperButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#F3F3F3",
    alignItems: "center",
    justifyContent: "center",
  },
  quantityValue: {
    minWidth: 44,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#2B8F17",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  quantityText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  footer: {
    marginHorizontal: 24,
    marginTop: 34,
    borderRadius: 22,
    backgroundColor: "#FAFAFA",
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  footerLabel: {
    fontSize: 12,
    color: "#7A7A7A",
    fontWeight: "700",
    marginBottom: 4,
  },
  footerPrice: {
    fontSize: 22,
    fontWeight: "800",
    color: "#171717",
  },
  cartButton: {
    flex: 1,
    height: 54,
    borderRadius: 16,
    backgroundColor: "#2B8F17",
    alignItems: "center",
    justifyContent: "center",
  },
  cartButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
});
