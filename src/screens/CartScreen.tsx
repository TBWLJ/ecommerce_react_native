import Ionicons from "@expo/vector-icons/build/Ionicons";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

export default function CartScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={22} color="#171717" />
        </TouchableOpacity>

        <Text style={styles.title}>Cart</Text>

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

      {/* Cart List Title */}
      <View style={styles.cartTitleContainer}>
        <Text style={styles.cartTitle}>My Cart List</Text>
      </View>

      {/* Cart Item */}
      <View style={styles.itemContainer}>
        {/* Product Image */}
        <View style={styles.imgBackground}>
          <Image
            source={{
              uri: "https://i.pravatar.cc/150?img=12",
            }}
            style={styles.productImage}
          />
        </View>

        {/* Product Details */}
        <View style={styles.productDetails}>
          <Text style={styles.productName}>Scoops</Text>
          <Text style={styles.priceStyle}>#300</Text>
        </View>

        {/* Quantity */}
        <View style={styles.quantityContainer}>
          <TouchableOpacity>
            <Text style={styles.quantityButton}>+</Text>
          </TouchableOpacity>

          <View style={styles.quantityBox}>
            <Text style={styles.quantityText}>1</Text>
          </View>

          <TouchableOpacity>
            <Text style={styles.quantityButton}>−</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Cart Summary */}
    <View style={styles.bottomSection}>
    {/* Subtotal */}
    <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Subtotal</Text>
        <Text style={styles.summaryPrice}>#300</Text>
    </View>

    {/* Total */}
    <View style={styles.summaryRow}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalPrice}>#300</Text>
    </View>

    {/* Checkout Button */}
    <TouchableOpacity
        style={styles.checkoutButton}
        activeOpacity={0.8}
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

  /* Header */
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#171717",
  },

  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
  },

  profileImage: {
    width: "100%",
    height: "100%",
  },

  /* Cart title */
  cartTitleContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
  },

  cartTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#171717",
  },

  /* Cart item */
  itemContainer: {
    marginHorizontal: 20,
    marginTop: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,

    flexDirection: "row",
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  imgBackground: {
    backgroundColor: "#F5F5F5",
    width: 100,
    height: 100,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  productImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  /* Product details */
  productDetails: {
    flex: 1,
    marginLeft: 12,
  },

  productName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#171717",
    marginBottom: 8,
  },

  priceStyle: {
    color: "#AEA7A7",
    fontSize: 16,
  },

  /* Quantity */
  quantityContainer: {
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },

  quantityButton: {
    fontSize: 22,
    fontWeight: "700",
    color: "#171717",
  },

  quantityBox: {
    backgroundColor: "#459E06",
    width: 35,
    height: 35,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },

  quantityText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
    /* Bottom Cart Summary */
  bottomSection: {
    marginTop: "auto",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 5,
  },

  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  summaryLabel: {
    fontSize: 16,
    color: "#777777",
  },

  summaryPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#171717",
  },

  totalLabel: {
    fontSize: 20,
    fontWeight: "700",
    color: "#171717",
  },

  totalPrice: {
    fontSize: 20,
    fontWeight: "700",
    color: "#171717",
  },

  checkoutButton: {
    height: 55,
    backgroundColor: "#459E06",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
  },

  checkoutText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
});