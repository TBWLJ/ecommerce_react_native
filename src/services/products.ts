import { requestJson } from "@/lib/api";
import { Product } from "@/types/models";

type ProductListResponse =
  | Product[]
  | {
      products?: unknown[];
      data?: unknown[];
      totalProducts?: number;
      totalPages?: number;
      currentPage?: number;
    };

function normalizeProduct(raw: Record<string, unknown>): Product {
  const image =
    String(raw.imageUrl || raw.image || raw.thumbnail || "") ||
    "https://via.placeholder.com/600x600.png?text=Product";

  const categories = Array.isArray(raw.categories)
    ? raw.categories.map(String)
    : raw.category
      ? [String(raw.category)]
      : [];

  return {
    id: String(raw._id || raw.id || raw.slug || `product_${Date.now()}`),
    name: String(raw.name || "Unnamed product"),
    description: String(raw.description || ""),
    image,
    imageUrl: image,
    price: Number(raw.price || 0),
    oldPrice:
      raw.oldPrice !== undefined && raw.oldPrice !== null
        ? Number(raw.oldPrice)
        : null,
    category: categories[0] || "Product",
    categories,
    rating:
      raw.rating !== undefined && raw.rating !== null
        ? Number(raw.rating)
        : null,
    reviews: Number(raw.reviews || 0),
    sold: String(raw.sold || raw.sales || "0"),
    brand: String(raw.brand || categories[0] || "Store"),
    createdAt: raw.createdAt ? String(raw.createdAt) : undefined,
    updatedAt: raw.updatedAt ? String(raw.updatedAt) : undefined,
    raw,
  };
}

export async function fetchProducts(): Promise<Product[]> {
  const payload = await requestJson<ProductListResponse>("/product");
  const list = Array.isArray(payload)
    ? payload
    : payload.products || payload.data || [];

  return list
    .filter((item): item is Record<string, unknown> => Boolean(item))
    .map(normalizeProduct);
}

export async function fetchProductById(id: string): Promise<Product> {
  const payload = await requestJson<{ product?: unknown; data?: unknown }>(
    `/product/find/${id}`
  );

  const raw = payload.product || payload.data || payload;
  if (!raw || typeof raw !== "object") {
    throw new Error("Product not found");
  }

  return normalizeProduct(raw as Record<string, unknown>);
}
