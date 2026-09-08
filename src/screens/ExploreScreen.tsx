import { Ionicons } from "@expo/vector-icons";
import {
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
import ProductCard from "@/components/ProductCard";

export default function ExploreScreen() {
  const router = useRouter();
  const { data: products = [], refetch, isFetching } = useProducts();
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const deferredSearch = useDeferredValue(searchText);

  const visibleProducts = products.filter((product) => {
    const query = deferredSearch.trim().toLowerCase();
    const matchesSearch =
      !query ||
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query);
    const matchesCategory =
      selectedCategory === "All" ||
      product.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.label}>Explore</Text>
            <Text style={styles.title}>Find your next pick</Text>
          </View>

          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => router.push("/cart")}
          >
            <Ionicons name="cart-outline" size={20} color="#171717" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#8A8A8A" />
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search products or categories"
            placeholderTextColor="#999999"
            style={styles.searchInput}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {["All", ...categories.map((item) => item.name)].map((item) => {
            const active = selectedCategory === item;
            return (
              <TouchableOpacity
                key={item}
                style={[styles.filterChip, active && styles.filterChipActive]}
                onPress={() => setSelectedCategory(item)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    active && styles.filterChipTextActive,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.heroCard}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=1200",
            }}
            style={styles.heroImage}
          />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <Text style={styles.heroLabel}>CURATED FOR YOU</Text>
            <Text style={styles.heroTitle}>
              Seasonal essentials, all in one place.
            </Text>
            <Text style={styles.heroText}>
              Browse products that match the moment, then save the ones you love.
            </Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>All products</Text>
          <Text style={styles.sectionMeta}>{visibleProducts.length} results</Text>
        </View>

        <View style={styles.grid}>
          {visibleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onPress={() => router.push(`/product/${product.id}`)}
            />
          ))}
        </View>

        {visibleProducts.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={36} color="#8A8A8A" />
            <Text style={styles.emptyTitle}>No items match your search</Text>
            <Text style={styles.emptyText}>
              Try a different keyword or switch categories.
            </Text>
          </View>
        )}

        <View style={{ height: 110 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 13,
    color: "#8A8A8A",
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#171717",
  },
  cartButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F6F6F6",
    alignItems: "center",
    justifyContent: "center",
  },
  searchContainer: {
    marginHorizontal: 20,
    height: 54,
    borderRadius: 17,
    backgroundColor: "#F6F6F6",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: "#171717",
  },
  filterRow: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 10,
  },
  filterChip: {
    borderRadius: 999,
    backgroundColor: "#F3F3F3",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  filterChipActive: {
    backgroundColor: "#2B8F17",
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4F4F4F",
  },
  filterChipTextActive: {
    color: "#FFFFFF",
  },
  heroCard: {
    height: 190,
    marginHorizontal: 20,
    marginTop: 18,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#171717",
    position: "relative",
  },
  heroImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.52)",
  },
  heroContent: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  heroLabel: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 8,
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    lineHeight: 29,
    fontWeight: "800",
  },
  heroText: {
    color: "rgba(255,255,255,0.84)",
    fontSize: 12,
    marginTop: 8,
    maxWidth: "88%",
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#171717",
  },
  sectionMeta: {
    fontSize: 12,
    color: "#7A7A7A",
    fontWeight: "600",
  },
  grid: {
    paddingHorizontal: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  emptyState: {
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 18,
    backgroundColor: "#FAFAFA",
    alignItems: "center",
    paddingVertical: 26,
    paddingHorizontal: 18,
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
});
