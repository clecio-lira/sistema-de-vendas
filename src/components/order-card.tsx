"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import type { Order } from "@/lib/storage";

interface OrderCardProps {
  order: Order;
  onUpdateStatus: (orderId: string, status: "aberto" | "fechado") => void;
}

export function OrderCard({ order, onUpdateStatus }: OrderCardProps) {
  const date = new Date(order.createdAt);
  const dateStr = date.toLocaleDateString("pt-BR");
  const timeStr = date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Card className={order.status === "fechado" ? "opacity-60" : ""}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base truncate">
              {order.customerName}
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              {dateStr} às {timeStr}
            </p>
          </div>
          <Badge variant={order.status === "aberto" ? "default" : "secondary"}>
            {order.status === "aberto" ? "Aberto" : "Fechado"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Itens do pedido */}
        <div className="space-y-1">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {item.quantity}x {item.productName}
              </span>
              <span className="font-medium">
                R$ {(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="pt-2 border-t">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Total</span>
            <span className="text-xl font-bold text-primary">
              R$ {order.total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Ações */}
        {order.status === "aberto" && (
          <Button
            onClick={() => onUpdateStatus(order.id, "fechado")}
            className="w-full"
            variant="default"
          >
            <Check className="mr-2 h-4 w-4" />
            Marcar como Pago
          </Button>
        )}

        {order.status === "fechado" && (
          <Button
            onClick={() => onUpdateStatus(order.id, "aberto")}
            className="w-full"
            variant="outline"
          >
            <X className="mr-2 h-4 w-4" />
            Reabrir Pedido
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
