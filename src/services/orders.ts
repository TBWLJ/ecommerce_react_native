import { requestJson } from "@/lib/api";
import { CartItem } from "@/types/models";

export type InitializeCheckoutInput = {
  items: CartItem[];
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  total: number;
};

type CheckoutResponse = {
  orderId: string;
  paymentUrl: string;
};

export async function initializeCheckout(
  input: InitializeCheckoutInput,
  token: string
) {
  return requestJson<CheckoutResponse>(
    "/checkout/checkout",
    {
      method: "POST",
      body: JSON.stringify({
        items: input.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.imageUrl,
        })),
        total: input.total,
        shipping: {
          name: input.fullName.trim(),
          email: input.email.trim().toLowerCase(),
          phone: input.phone.trim(),
          address: input.address.trim(),
          city: input.city.trim(),
          state: input.state.trim(),
          country: input.country.trim(),
        },
      }),
    },
    token
  );
}
