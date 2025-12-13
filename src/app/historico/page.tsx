"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { storage, type Order } from "@/lib/storage";
import { OrderCard } from "@/components/order-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function HistoricoPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<"todos" | "aberto" | "fechado">("todos");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    const allOrders = storage
      .getOrders()
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    setOrders(allOrders);
  };

  const handleUpdateStatus = (
    orderId: string,
    status: "aberto" | "fechado"
  ) => {
    storage.updateOrder(orderId, { status });
    loadOrders();
  };

  const handleDeleteOrder = (orderId: string) => {
    storage.deleteOrder(orderId);
    loadOrders();
  };

  const filteredOrders = useMemo(() => {
    if (filter === "todos") return orders;
    return orders.filter((order) => order.status === filter);
  }, [orders, filter]);

  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOrders = orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      orderDate.setHours(0, 0, 0, 0);
      return orderDate.getTime() === today.getTime();
    });

    const totalToday = todayOrders.reduce((sum, order) => sum + order.total, 0);
    const openOrders = orders.filter((order) => order.status === "aberto");
    const totalOpen = openOrders.reduce((sum, order) => sum + order.total, 0);

    return {
      todayCount: todayOrders.length,
      todayTotal: totalToday,
      openCount: openOrders.length,
      openTotal: totalOpen,
    };
  }, [orders]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-primary text-primary-foreground shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="secondary"
              size="icon"
              onClick={() => router.push("/")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">Histórico de Pedidos</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Vendas Hoje</p>
                  <p className="text-2xl font-bold text-foreground">
                    {stats.todayCount}
                  </p>
                  <p className="text-sm font-medium text-primary">
                    R$ {stats.todayTotal.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">
                    Pedidos Abertos
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {stats.openCount}
                  </p>
                  <p className="text-sm font-medium text-primary">
                    R$ {stats.openTotal.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Tabs
          value={filter}
          onValueChange={(v) => setFilter(v as typeof filter)}
          className="mb-6"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="todos">Todos ({orders.length})</TabsTrigger>
            <TabsTrigger value="aberto">
              Abertos ({orders.filter((o) => o.status === "aberto").length})
            </TabsTrigger>
            <TabsTrigger value="fechado">
              Fechados ({orders.filter((o) => o.status === "fechado").length})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Lista de Pedidos */}
        <div className="space-y-3">
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  Nenhum pedido encontrado
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onUpdateStatus={handleUpdateStatus}
                onDelete={handleDeleteOrder}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}
