import { fetchInvoices } from "@/firebase/invoice";
import { useQuery } from "@tanstack/react-query";

export function useInvoicesQuery() {
  return useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      return await fetchInvoices();
    },
  });
}
