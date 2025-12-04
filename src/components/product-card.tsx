"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Product } from "@/lib/storage";

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

export function ProductCard({ product, onAdd }: ProductCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base truncate text-foreground">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground">{product.category}</p>
            <p className="text-lg font-bold text-primary mt-1">
              R$ {product.price.toFixed(2)}
            </p>
          </div>
          <Button
            size="icon"
            onClick={() => onAdd(product)}
            className="shrink-0 h-12 w-12 rounded-xl"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
