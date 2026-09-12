import { requestJson } from "@/lib/api";
import { CartItem } from "@/types/models";

export type CreateOrderInput = {
  items: CartItem[];
  fullName: string;
  phone: string;
  address: string;
  city: string;
  note: string;
  paymentMethod: string;
  subtotal: number;
  shipping: number;
  total: number;
};

type OrderResponse = {
  _id?: string;
  id?: string;
  orderId?: string;
  data?: { _id?: string; id?: string; orderId?: string };
};

export async function createOrder(input: CreateOrderInput, token: string) {
  const payload = await requestJson<OrderResponse>(
    "/orders",
    {
      method: "POST",
      body: JSON.stringify({
        items: input.items.map((item) => ({
          product: item.id,
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        shippingAddress: {
          fullName: input.fullName.trim(),
          phone: input.phone.trim(),
          address: input.address.trim(),
          city: input.city.trim(),
          note: input.note.trim(),
        },
        paymentMethod: input.paymentMethod,
        subtotal: input.subtotal,
        shipping: input.shipping,
        total: input.total,
      }),
    },
    token
  );

  return String(
    payload.orderId || payload._id || payload.id || payload.data?.orderId ||
      payload.data?._id || payload.data?.id || ""
  );
}
