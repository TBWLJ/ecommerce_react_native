import { Ionicons } from "@expo/vector-icons";
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";
import { useCartStore } from "@/store/cart";
import { formatMoney } from "@/lib/money";
import { Product } from "@/types/models";

type Props = {
  product: Product;
  onPress: () => void;
};

export default function ProductCard({ product, onPress }: Props) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <TouchableOpacity activeOpacity={0.9} style={styles.card} onPress={onPress}>
      <View style={styles.imageWrap}>
        <Image source={{ uri: product.image }} style={styles.image} />

        <View style={styles.badge}>
          <Text style={styles.badgeText}>{product.category}</Text>
        </View>

        <TouchableOpacity
          style={styles.heartButton}
          onPress={() => {
            // Wishlist can be wired to a persisted store later.
          }}
        >
          <Ionicons name="heart-outline" size={18} color="#171717" />
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        <Text style={styles.category} numberOfLines={1}>
          {product.category}
        </Text>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatMoney(product.price)}</Text>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => addItem(product)}
          >
            <Ionicons name="add" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    marginBottom: 22,
    backgroundColor: "#FFFFFF",
  },
  imageWrap: {
    borderRadius: 18,
    overflow: "hidden",
    height: 180,
    backgroundColor: "#F5F5F5",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  badge: {
    position: "absolute",
    left: 10,
    top: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 9,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#171717",
  },
  heartButton: {
    position: "absolute",
    right: 10,
    top: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  body: {
    paddingTop: 12,
  },
  category: {
    fontSize: 11,
    color: "#8A8A8A",
    fontWeight: "600",
    marginBottom: 4,
  },
  name: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "700",
    color: "#171717",
    minHeight: 40,
  },
  priceRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  price: {
    fontSize: 15,
    fontWeight: "800",
    color: "#171717",
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2B8F17",
  },
});
