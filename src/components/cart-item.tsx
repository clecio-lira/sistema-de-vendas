"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Minus, Plus, Trash2 } from "lucide-react";
import type { OrderItem } from "@/lib/storage";

interface CartItemProps {
  item: OrderItem;
  onUpdateQuantity: (productId: string, change: number) => void;
  onRemove: (productId: string) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm truncate">{item.productName}</h4>
            <p className="text-xs text-muted-foreground">
              R$ {item.price.toFixed(2)} cada
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8 bg-transparent"
              onClick={() => onUpdateQuantity(item.productId, -1)}
            >
              <Minus className="h-3 w-3" />
            </Button>

            <span className="font-bold text-lg min-w-[2ch] text-center">
              {item.quantity}
            </span>

            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8 bg-transparent"
              onClick={() => onUpdateQuantity(item.productId, 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <div className="flex flex-col items-end gap-2">
            <p className="font-bold text-primary">
              R$ {(item.price * item.quantity).toFixed(2)}
            </p>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => onRemove(item.productId)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
