import React, { createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Product, DocStep, events } from "../data/kalasangam";

const API_URL = "http://localhost:8000/api";

type StoreContextType = {
  products: Product[];
  docSteps: DocStep[];
  events: typeof events;
  addProduct: (product: Omit<Product, "id">) => void;
  verifyProduct: (id: string) => void;
  updateDocStatus: (id: string, status: DocStep["status"]) => void;
  isLoading: boolean;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  // Fetch products
  const { data: products = [], isLoading: isLoadingProducts } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/products`);
      if (!res.ok) return [];
      return res.json();
    },
  });

  // Fetch docs
  const { data: docSteps = [], isLoading: isLoadingDocs } = useQuery<DocStep[]>({
    queryKey: ["docs"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/docs`);
      if (!res.ok) return [];
      return res.json();
    },
  });

  // Mutations
  const addProductMutation = useMutation({
    mutationFn: async (product: Omit<Product, "id">) => {
      const res = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const verifyProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${API_URL}/products/${id}/verify`, {
        method: "PUT",
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const updateDocMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: DocStep["status"] }) => {
      const res = await fetch(`${API_URL}/docs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["docs"] });
    },
  });

  const addProduct = (product: Omit<Product, "id">) => {
    addProductMutation.mutate(product);
  };

  const verifyProduct = (id: string) => {
    verifyProductMutation.mutate(id);
  };

  const updateDocStatus = (id: string, status: DocStep["status"]) => {
    updateDocMutation.mutate({ id, status });
  };

  const isLoading = isLoadingProducts || isLoadingDocs;

  return (
    <StoreContext.Provider
      value={{
        products,
        docSteps,
        events, // Kept static for now as per requirements
        addProduct,
        verifyProduct,
        updateDocStatus,
        isLoading,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
