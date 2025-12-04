"use client";

import { useState, useEffect } from "react";
import { ProductCard } from "./product-card";
import { storage, type Product } from "@/lib/storage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProductsGridProps {
  onAddProduct: (product: Product) => void;
}

export function ProductsGrid({ onAddProduct }: ProductsGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    storage.initializeDefaults();
    const allProducts = storage.getProducts();
    setProducts(allProducts);

    // Extrair categorias únicas
    const uniqueCategories = Array.from(
      new Set(allProducts.map((p) => p.category))
    );
    setCategories(["Todos", ...uniqueCategories]);
  }, []);

  const getFilteredProducts = (category: string) => {
    if (category === "Todos") return products;
    return products.filter((p) => p.category === category);
  };

  return (
    <Tabs defaultValue="Todos" className="w-full">
      <TabsList className="w-full grid grid-cols-4 lg:grid-cols-5 mb-4">
        {categories.map((cat) => (
          <TabsTrigger key={cat} value={cat} className="text-xs sm:text-sm">
            {cat}
          </TabsTrigger>
        ))}
      </TabsList>

      {categories.map((cat) => (
        <TabsContent key={cat} value={cat} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {getFilteredProducts(cat).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAdd={onAddProduct}
              />
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
