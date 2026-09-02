import React, { createContext, useContext, useState } from 'react';

export type Product = {
  id: string;
  title: string;
  price: string;
  material: string;
  status: 'In progress' | 'Live' | 'Needs attention';
  hasPhoto: boolean;
};

type AppContextType = {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  draftProduct: Partial<Product> | null;
  setDraftProduct: (draft: Partial<Product> | null) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialProducts: Product[] = [
  { id: '1', title: 'Indigo Handwoven Saree', price: '₹ 2,400', material: 'Pure cotton', status: 'Live', hasPhoto: true },
  { id: '2', title: 'Terracotta Vase', price: '₹ 850', material: 'Clay', status: 'Live', hasPhoto: true },
  { id: '3', title: 'Block Print Dupatta', price: '₹ 1,200', material: 'Silk', status: 'Needs attention', hasPhoto: true },
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [draftProduct, setDraftProduct] = useState<Partial<Product> | null>(null);

  const addProduct = (product: Product) => {
    setProducts((prev) => [product, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  return (
    <AppContext.Provider value={{ products, addProduct, updateProduct, draftProduct, setDraftProduct }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
}
