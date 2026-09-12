export type AuthRole = "customer" | "admin";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: AuthRole;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  oldPrice: number | null;
  category: string;
  categories: string[];
  rating: number | null;
  reviews: number;
  sold: string | number;
  brand: string;
  imageUrl: string;
  createdAt?: string;
  updatedAt?: string;
  raw: Record<string, unknown>;
};

export type CartItem = Product & {
  quantity: number;
};
