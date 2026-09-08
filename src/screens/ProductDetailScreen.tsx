import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

const API_URL = `https://shop4me-7d6d.onrender.com/api/product/find`;

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/${id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch product");
      }

      const data = await response.json();

      setProduct(data.product || data.data || data);
    } catch (error) {
      console.error("Fetch product error:", error);
      setError("Unable to load this product.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#E53935" />
          <Text style={styles.loadingText}>Loading product...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !product) {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#171717" />
        </TouchableOpacity>

        <View style={styles.center}>
          <Ionicons name="alert-circle-outline" size={45} color="#999" />
          <Text style={styles.errorText}>
            {error || "Product not found"}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* IMAGE + FLOATING PRICE */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />

          {/* Floating price badge (matches UI) */}
          <View style={styles.priceBadge}>
            <Text style={styles.priceBadgeText}>
              ₦{Number(product.price || 0).toLocaleString()}
            </Text>
            <View style={styles.priceBadgeIcon}>
              <Text style={styles.priceBadgeIconText}>A</Text>
            </View>
          </View>

          {/* Back button overlaid on image */}
          <TouchableOpacity
            style={styles.backButtonOverlay}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={22} color="#171717" />
          </TouchableOpacity>
        </View>

        {/* PRODUCT INFO */}
        <View style={styles.info}>
          <Text style={styles.name}>{product.name}</Text>

          <Text style={styles.brand}>
            by {product.categories?.[0] || product.brand || "Jenny Powerkemp"}
          </Text>

          {/* Heart + sold row */}
          <View style={styles.metaRow}>
            <Ionicons name="heart" size={18} color="#E53935" />
            <View style={styles.soldDots}>
              <View style={styles.dot} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
            <Text style={styles.soldText}>
              {product.sold || product.sales || "125.00"} sold
            </Text>
          </View>

          {/* Description */}
          <Text style={styles.descriptionTitle}>Description</Text>
          <Text style={styles.description}>
            {product.description ||
              "Mauris neque felis, faucibus auctor, facilisis suscipit dui. Cras auctor. Mauris neque felis et posuere."}
          </Text>
        </View>

        {/* ADD TO CART */}
        <TouchableOpacity
          style={styles.cartButton}
          activeOpacity={0.85}
          onPress={() => {
            // Add cart logic here
          }}
        >
          <Text style={styles.cartButtonText}>Add To Cart</Text>
        </TouchableOpacity>
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
    paddingBottom: 40,
  },

  /* IMAGE SECTION */
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

  /* Floating price badge (top-right) */
  priceBadge: {
    position: "absolute",
    top: 18,
    right: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },

  priceBadgeText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#171717",
  },

  priceBadgeIcon: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: "#E53935",
    alignItems: "center",
    justifyContent: "center",
  },

  priceBadgeIconText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },

  /* Back button overlaid */
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  /* INFO SECTION */
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
  },

  soldDots: {
    flexDirection: "row",
    gap: 3,
    marginLeft: 2,
  },

  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#E53935",
  },

  soldText: {
    fontSize: 13,
    color: "#E53935",
    fontWeight: "600",
    marginLeft: 2,
  },

  descriptionTitle: {
    marginTop: 28,
    fontSize: 16,
    fontWeight: "700",
    color: "#171717",
  },

  description: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 22,
    color: "#757575",
  },

  /* ADD TO CART BUTTON */
  cartButton: {
    marginHorizontal: 24,
    marginTop: 32,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#E53935",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#E53935",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },

  cartButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  /* LOADING / ERROR */
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: "#777777",
  },

  errorText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
  },

  backButton: {
    position: "absolute",
    top: 16,
    left: 20,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#F6F6F6",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
});