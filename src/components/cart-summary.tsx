"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Receipt } from "lucide-react";
import type { OrderItem } from "@/lib/storage";

interface CartSummaryProps {
  items: OrderItem[];
  onFinalize: () => void;
  disabled?: boolean;
}

export function CartSummary({ items, onFinalize, disabled }: CartSummaryProps) {
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Card className="sticky bottom-0 shadow-lg border-2 border-primary/20">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {itemCount} {itemCount === 1 ? "item" : "itens"}
            </span>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-2xl font-bold text-primary">
              R$ {total.toFixed(2)}
            </p>
          </div>
        </div>

        <Button
          onClick={onFinalize}
          disabled={disabled || items.length === 0}
          className="w-full h-12 text-base font-semibold"
          size="lg"
        >
          <Receipt className="mr-2 h-5 w-5" />
          Finalizar Pedido
        </Button>
      </CardContent>
    </Card>
  );
}
