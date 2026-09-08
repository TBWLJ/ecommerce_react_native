import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDeferredValue, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { categories } from "@/constants/catalog";
import { useProducts } from "@/hooks/useProducts";
import { useAuthStore } from "@/store/auth";
import ProductCard from "@/components/ProductCard";

export default function HomeScreen() {
  const router = useRouter();
  const { data: products = [], isLoading, isError, refetch, isFetching } =
    useProducts();
  const user = useAuthStore((state) => state.user);
  const [searchText, setSearchText] = useState("");
  const deferredSearch = useDeferredValue(searchText);

  const filteredProducts = products.filter((product) => {
    const query = deferredSearch.trim().toLowerCase();
    if (!query) {
      return true;
    }

    return (
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    );
  });

  const openProduct = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2B8F17" />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} />
        }
      >
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.smallGreeting}>
              {user ? "Welcome back" : "Good morning"}
            </Text>
            <Text style={styles.username}>
              {user ? user.name : "Discover something new"}
            </Text>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.iconButton}
              activeOpacity={0.7}
              onPress={() => router.push("/profile")}
            >
              {user ? (
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
              ) : (
                <Ionicons name="person-outline" size={20} color="#171717" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchRow}>
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color="#8A8A8A" />
            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Search products..."
              placeholderTextColor="#999999"
              style={styles.searchInput}
              returnKeyType="search"
            />
            <TouchableOpacity activeOpacity={0.7}>
              <Ionicons name="options-outline" size={20} color="#171717" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.promoContainer}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200",
            }}
            style={styles.promoImage}
          />
          <View style={styles.promoOverlay} />
          <View style={styles.promoContent}>
            <Text style={styles.promoLabel}>LIMITED OFFER</Text>
            <Text style={styles.promoTitle}>
              New season.
              {"\n"}
              New essentials.
            </Text>
            <Text style={styles.promoDescription}>
              Discover handpicked products built for every day.
            </Text>
            <TouchableOpacity
              style={styles.shopButton}
              activeOpacity={0.85}
              onPress={() => router.push("/explore")}
            >
              <Text style={styles.shopButtonText}>Shop now</Text>
              <Ionicons name="arrow-forward" size={16} color="#171717" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <TouchableOpacity onPress={() => router.push("/explore")}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {categories.map((category) => (
            <TouchableOpacity key={category.id} style={styles.categoryItem}>
              <View style={styles.categoryIcon}>
                <Ionicons name={category.icon} size={22} color="#171717" />
              </View>
              <Text style={styles.categoryName}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Latest products</Text>
            <Text style={styles.productCount}>
              {filteredProducts.length} products
            </Text>
          </View>
          <TouchableOpacity onPress={() => router.push("/explore")}>
            <Text style={styles.seeAll}>Explore</Text>
          </TouchableOpacity>
        </View>

        {isError && (
          <View style={styles.errorContainer}>
            <Ionicons name="cloud-offline-outline" size={32} color="#555555" />
            <Text style={styles.errorTitle}>Something went wrong</Text>
            <Text style={styles.errorText}>
              We could not load products right now.
            </Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => refetch()}
            >
              <Text style={styles.retryText}>Try again</Text>
            </TouchableOpacity>
          </View>
        )}

        {!isError && filteredProducts.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="cube-outline" size={42} color="#AAAAAA" />
            <Text style={styles.emptyTitle}>No products found</Text>
            <Text style={styles.emptyText}>
              Try a different search or check Explore.
            </Text>
          </View>
        )}

        <View style={styles.productGrid}>
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onPress={() => openProduct(product.id)}
            />
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 14,
    fontSize: 15,
    color: "#5F5F5F",
    fontWeight: "600",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  smallGreeting: {
    fontSize: 13,
    color: "#8A8A8A",
    marginBottom: 4,
  },
  username: {
    fontSize: 20,
    fontWeight: "800",
    color: "#171717",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F6F6F6",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  searchRow: {
    paddingHorizontal: 20,
    marginBottom: 18,
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
    marginHorizontal: 10,
    fontSize: 14,
    color: "#171717",
  },
  promoContainer: {
    height: 220,
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
    backgroundColor: "rgba(0,0,0,0.5)",
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
    letterSpacing: 1,
    marginBottom: 8,
  },
  promoTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    lineHeight: 32,
    fontWeight: "800",
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
  errorContainer: {
    marginHorizontal: 20,
    borderRadius: 18,
    padding: 18,
    backgroundColor: "#FAFAFA",
    alignItems: "center",
    gap: 8,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#171717",
  },
  errorText: {
    fontSize: 13,
    color: "#666666",
    textAlign: "center",
  },
  retryButton: {
    marginTop: 4,
    backgroundColor: "#2B8F17",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  retryText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 13,
  },
  emptyContainer: {
    marginHorizontal: 20,
    borderRadius: 18,
    padding: 22,
    backgroundColor: "#FAFAFA",
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
  productGrid: {
    paddingHorizontal: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 6,
  },
});
