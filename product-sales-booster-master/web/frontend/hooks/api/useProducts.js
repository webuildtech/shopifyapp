import { useAppQuery } from "../useAppQuery";

export default function useProducts() {
  const { data, isLoading, isError } = useAppQuery({ url: "/api/products" });
  return { products: data, isLoading, isError };
}
