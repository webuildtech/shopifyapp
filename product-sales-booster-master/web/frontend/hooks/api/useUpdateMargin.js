import { useAuthenticatedFetch } from "../useAuthenticatedFetch";

export default function useUpdateMargin() {
  const fetch = useAuthenticatedFetch();
  return {
    updateMargin: async (productId, margin) => {
      const response = await fetch(`/api/margins?productId=${productId}&margin=${margin}`, {
        method: "PUT",
      });
      const json = await response.json();
      return json;
    }
  }
}
