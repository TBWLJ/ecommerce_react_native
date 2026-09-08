import { useQuery } from "@tanstack/react-query";
import { fetchProductById } from "@/services/products";

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => {
      if (!id) {
        throw new Error("Missing product id");
      }

      return fetchProductById(id);
    },
    enabled: Boolean(id),
  });
}
