import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Dimensions,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

const API_URL = "https://shop4me-7d6d.onrender.com/api/product";

/* =========================================================
   FETCH PRODUCTS
========================================================= */

const fetchProducts = async () => {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`);
    }

    const data = await response.json();

    // Your API appears to return a paginated response.
    // Support both:
    // { products: [...] }
    // and directly returned arrays.
    const products = Array.isArray(data)
      ? data
      : data.products || data.data || [];

    return {
      products,
      totalProducts: data.totalProducts || products.length,
      totalPages: data.totalPages || 1,
      currentPage: data.currentPage || 1,
    };
  } catch (error) {
    console.error("Fetch products error:", error);
    throw error;
  }
};

/* =========================================================
   FORMAT PRODUCT
========================================================= */

const formatProduct = (product) => {
  return {
    id: product._id,

    name: product.name || "Unnamed product",

    description: product.description || "",

    image:
      product.imageUrl ||
      "https://via.placeholder.com/500",

    price: product.price || 0,

    category:
      product.categories?.[0] || "Product",

    categories: product.categories || [],

    createdAt: product.createdAt,

    updatedAt: product.updatedAt,

    // Your current API example doesn't contain these.
    // Defaults are used so the UI doesn't break.
    rating: product.rating || null,
    reviews: product.reviews || 0,

    oldPrice: product.oldPrice || null,

    discount: product.discount || null,

    // Keep the original API response too.
    ...product,
  };
};

/* =========================================================
   CATEGORIES
========================================================= */

const categories = [
  {
    id: "1",
    name: "New",
    icon: "sparkles-outline",
  },
  {
    id: "2",
    name: "Food",
    icon: "fast-food-outline",
  },
  {
    id: "3",
    name: "Fashion",
    icon: "shirt-outline",
  },
  {
    id: "4",
    name: "Beauty",
    icon: "sparkles-outline",
  },
  {
    id: "5",
    name: "Electronics",
    icon: "phone-portrait-outline",
  },
  {
    id: "6",
    name: "Home",
    icon: "home-outline",
  },
];

/* =========================================================
   HOME SCREEN
========================================================= */

export default function HomeScreen() {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState(null);

  const [searchText, setSearchText] = useState("");

  /* =======================================================
     LOAD PRODUCTS
  ======================================================= */

  const loadProducts = useCallback(async () => {
    try {
      setError(null);

      const result = await fetchProducts();

      const formattedProducts = result.products.map(formatProduct);

      setProducts(formattedProducts);
    } catch (error) {
      console.error(error);

      setError(
        "Unable to load products. Please check your connection."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  /* =======================================================
     INITIAL FETCH
  ======================================================= */

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  /* =======================================================
     PULL TO REFRESH
  ======================================================= */

  const handleRefresh = async () => {
    setRefreshing(true);

    try {
      await loadProducts();
    } finally {
      setRefreshing(false);
    }
  };

  /* =======================================================
     SEARCH
  ======================================================= */

  const filteredProducts = products.filter((product) =>
    product.name
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  /* =======================================================
     PRODUCT NAVIGATION
  ======================================================= */

  const openProduct = (product) => {
    router.push({
      pathname: "/product/[id]",
      params: {
        id: product.id,
      },
    });
  };

  /* =======================================================
     LOADING STATE
  ======================================================= */

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#FFFFFF"
        />

        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color="#171717"
          />

          <Text style={styles.loadingText}>
            Loading products...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
        translucent={false}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <View style={styles.header}>
          <View>
            <Text style={styles.smallGreeting}>
              Good morning 👋
            </Text>

            <Text style={styles.username}>
              Discover something new
            </Text>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.iconButton}
              activeOpacity={0.7}
            >
              <Ionicons
                name="notifications-outline"
                size={22}
                color="#171717"
              />

              <View style={styles.notificationDot} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.profileButton}
              activeOpacity={0.8}
            >
              <Image
                source={{
                  uri: "https://i.pravatar.cc/150?img=12",
                }}
                style={styles.profileImage}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* =================================================
            SEARCH
        ================================================= */}

        <View style={styles.searchRow}>
          <View style={styles.searchContainer}>
            <Ionicons
              name="search-outline"
              size={21}
              color="#8A8A8A"
            />

            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Search products..."
              placeholderTextColor="#999999"
              style={styles.searchInput}
              returnKeyType="search"
            />

            <TouchableOpacity
              activeOpacity={0.7}
            >
              <Ionicons
                name="options-outline"
                size={21}
                color="#171717"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* =================================================
            PROMO BANNER
        ================================================= */}

        <View style={styles.promoContainer}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200",
            }}
            style={styles.promoImage}
          />

          <View style={styles.promoOverlay} />

          <View style={styles.promoContent}>
            <Text style={styles.promoLabel}>
              LIMITED OFFER
            </Text>

            <Text style={styles.promoTitle}>
              New season.{"\n"}
              New essentials.
            </Text>

            <Text style={styles.promoDescription}>
              Discover our latest collection
            </Text>

            <TouchableOpacity
              style={styles.shopButton}
              activeOpacity={0.8}
            >
              <Text style={styles.shopButtonText}>
                Shop now
              </Text>

              <Ionicons
                name="arrow-forward"
                size={16}
                color="#171717"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* =================================================
            CATEGORIES
        ================================================= */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Categories
          </Text>

          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.seeAll}>
              See all
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryItem}
              activeOpacity={0.75}
            >
              <View style={styles.categoryIcon}>
                <Ionicons
                  name={category.icon}
                  size={24}
                  color="#171717"
                />
              </View>

              <Text style={styles.categoryName}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* =================================================
            PRODUCTS HEADER
        ================================================= */}

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Latest products
            </Text>

            {products.length > 0 && (
              <Text style={styles.productCount}>
                {products.length} products
              </Text>
            )}
          </View>

          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.seeAll}>
              See all
            </Text>
          </TouchableOpacity>
        </View>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <View style={styles.errorContainer}>
            <Ionicons
              name="cloud-offline-outline"
              size={30}
              color="#555555"
            />

            <Text style={styles.errorTitle}>
              Something went wrong
            </Text>

            <Text style={styles.errorText}>
              {error}
            </Text>

            <TouchableOpacity
              style={styles.retryButton}
              onPress={loadProducts}
            >
              <Text style={styles.retryText}>
                Try again
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* =================================================
            EMPTY
        ================================================= */}

        {!error && filteredProducts.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="cube-outline"
              size={42}
              color="#AAAAAA"
            />

            <Text style={styles.emptyTitle}>
              No products found
            </Text>

            <Text style={styles.emptyText}>
              Try searching for something else.
            </Text>
          </View>
        )}

        {/* =================================================
            PRODUCT GRID
        ================================================= */}

        <View style={styles.productGrid}>
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onPress={() => openProduct(product)}
            />
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* =========================================================
   PRODUCT CARD
========================================================= */

function ProductCard({ product, onPress }) {
  const hasRating = product.rating !== null;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.productCard}
      onPress={onPress}
    >
      {/* IMAGE */}

      <View style={styles.productImageContainer}>
        <Image
          source={{
            uri: product.image,
          }}
          style={styles.productImage}
          resizeMode="cover"
        />

        {/* CATEGORY */}

        {product.category && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>
              {product.category}
            </Text>
          </View>
        )}

        {/* HEART */}

        <TouchableOpacity
          style={styles.heartButton}
          activeOpacity={0.7}
          onPress={() => {
            // Add wishlist logic here later
          }}
        >
          <Ionicons
            name="heart-outline"
            size={19}
            color="#171717"
          />
        </TouchableOpacity>
      </View>

      {/* INFORMATION */}

      <View style={styles.productInfo}>
        <Text
          style={styles.productCategory}
          numberOfLines={1}
        >
          {product.category}
        </Text>

        <Text
          style={styles.productName}
          numberOfLines={2}
        >
          {product.name}
        </Text>

        {/* RATING */}

        {hasRating && (
          <View style={styles.ratingRow}>
            <Ionicons
              name="star"
              size={13}
              color="#F5A623"
            />

            <Text style={styles.rating}>
              {product.rating}
            </Text>

            <Text style={styles.reviewCount}>
              ({product.reviews})
            </Text>
          </View>
        )}

        {/* PRICE */}

        <View style={styles.priceRow}>
          <View>
            <Text style={styles.productPrice}>
              ₦{Number(product.price).toLocaleString()}
            </Text>

            {product.oldPrice && (
              <Text style={styles.oldPrice}>
                ₦
                {Number(
                  product.oldPrice
                ).toLocaleString()}
              </Text>
            )}
          </View>

          {/* ADD */}

          <TouchableOpacity
            style={styles.addButton}
            activeOpacity={0.8}
            onPress={() => {
              // Add to cart logic here later
            }}
          >
            <Ionicons
              name="add"
              size={21}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  scrollContent: {
    paddingBottom: 30,
  },

  /* ================= HEADER ================= */

  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  smallGreeting: {
    fontSize: 13,
    color: "#8A8A8A",
    marginBottom: 4,
  },

  username: {
    fontSize: 20,
    fontWeight: "700",
    color: "#171717",
    letterSpacing: -0.4,
  },

  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#F6F6F6",
    alignItems: "center",
    justifyContent: "center",
  },

  notificationDot: {
    position: "absolute",
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#FF4D4D",
    top: 9,
    right: 10,
    borderWidth: 1.5,
    borderColor: "#F6F6F6",
  },

  profileButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    overflow: "hidden",
  },

  profileImage: {
    width: "100%",
    height: "100%",
  },

  /* ================= SEARCH ================= */

  searchRow: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  searchContainer: {
    height: 54,
    backgroundColor: "#F6F6F6",
    borderRadius: 17,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  searchInput: {
    flex: 1,
    marginHorizontal: 11,
    fontSize: 14,
    color: "#171717",
  },

  /* ================= PROMO ================= */

  promoContainer: {
    height: 210,
    marginHorizontal: 20,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#171717",
    position: "relative",
  },

  promoImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },

  promoOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.52)",
  },

  promoContent: {
    zIndex: 2,
    padding: 22,
    flex: 1,
    justifyContent: "center",
  },

  promoLabel: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.4,
    marginBottom: 8,
  },

  promoTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    lineHeight: 32,
    fontWeight: "800",
    letterSpacing: -0.8,
  },

  promoDescription: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 12,
    marginTop: 8,
  },

  shopButton: {
    marginTop: 16,
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  shopButtonText: {
    color: "#171717",
    fontSize: 12,
    fontWeight: "700",
  },

  /* ================= SECTIONS ================= */

  sectionHeader: {
    paddingHorizontal: 20,
    marginTop: 28,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#171717",
    letterSpacing: -0.4,
  },

  productCount: {
    fontSize: 11,
    color: "#999999",
    marginTop: 3,
  },

  seeAll: {
    fontSize: 13,
    fontWeight: "600",
    color: "#777777",
  },

  /* ================= CATEGORIES ================= */

  categoryScroll: {
    paddingHorizontal: 20,
    gap: 13,
  },

  categoryItem: {
    alignItems: "center",
    width: 68,
  },

  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: "#F6F6F6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  categoryName: {
    fontSize: 11,
    color: "#444444",
    fontWeight: "600",
    textAlign: "center",
  },

  /* ================= PRODUCTS ================= */

  productGrid: {
    paddingHorizontal: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  productCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    marginBottom: 22,
  },

  productImageContainer: {
    width: "100%",
    height: width * 0.52,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#F5F5F5",
    position: "relative",
  },

  productImage: {
    width: "100%",
    height: "100%",
  },

  discountBadge: {
    position: "absolute",
    left: 10,
    top: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 5,
  },

  discountText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#171717",
    textTransform: "uppercase",
  },

  heartButton: {
    position: "absolute",
    right: 10,
    top: 10,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.92)",
    alignItems: "center",
    justifyContent: "center",
  },

  productInfo: {
    paddingTop: 10,
  },

  productCategory: {
    fontSize: 10,
    color: "#999999",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  productName: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "700",
    color: "#171717",
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 7,
  },

  rating: {
    fontSize: 11,
    fontWeight: "700",
    color: "#333333",
    marginLeft: 4,
  },

  reviewCount: {
    fontSize: 10,
    color: "#999999",
    marginLeft: 3,
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: 8,
  },

  productPrice: {
    fontSize: 16,
    fontWeight: "800",
    color: "#171717",
  },

  oldPrice: {
    fontSize: 10,
    color: "#AAAAAA",
    textDecorationLine: "line-through",
    marginTop: 2,
  },

  addButton: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: "#171717",
    alignItems: "center",
    justifyContent: "center",
  },

  /* ================= LOADING ================= */

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: "#777777",
  },

  /* ================= ERROR ================= */

  errorContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 25,
    borderRadius: 20,
    backgroundColor: "#F7F7F7",
    alignItems: "center",
  },

  errorTitle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "700",
    color: "#171717",
  },

  errorText: {
    marginTop: 6,
    fontSize: 12,
    color: "#777777",
    textAlign: "center",
    lineHeight: 18,
  },

  retryButton: {
    marginTop: 15,
    backgroundColor: "#171717",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },

  retryText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },

  /* ================= EMPTY ================= */

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },

  emptyTitle: {
    marginTop: 12,
    fontSize: 17,
    fontWeight: "700",
    color: "#333333",
  },

  emptyText: {
    marginTop: 5,
    fontSize: 12,
    color: "#999999",
  },
});