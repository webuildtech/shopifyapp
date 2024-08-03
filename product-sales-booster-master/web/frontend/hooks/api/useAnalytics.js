import { useAppQuery } from "../useAppQuery";

export default function useAnalytics() {
  const { data, isLoading, isError } = useAppQuery({ url: "/api/analytics" });
  return { analytics: data, isLoading, isError };
}
