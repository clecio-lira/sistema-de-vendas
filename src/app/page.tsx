"use client";

import { useState, useEffect } from "react";
import { CustomerSelector } from "@/components/customer-selector";
import { ProductsGrid } from "@/components/products-grid";
import { CartItem } from "@/components/cart-item";
import { CartSummary } from "@/components/cart-summary";
import {
  storage,
  type Customer,
  type Product,
  type OrderItem,
} from "@/lib/storage";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ShoppingBag, History } from "lucide-react";
import { toast } from "sonner";

export default function HomePage() {
  const router = useRouter();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (selectedCustomer) {
      const openOrder = storage.getOpenOrderByCustomer(selectedCustomer.id);
      if (openOrder) {
        setCartItems(openOrder.items);
        setCurrentOrderId(openOrder.id);
        toast.success("Pedido carregado");
      } else {
        setCartItems([]);
        setCurrentOrderId(null);
      }
    } else {
      setCartItems([]);
      setCurrentOrderId(null);
    }
  }, [selectedCustomer]);

  const handleAddProduct = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id);

      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          quantity: 1,
          price: product.price,
        },
      ];
    });

    toast.success("Produto adicionado");
  };

  const handleUpdateQuantity = (productId: string, change: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.max(0, item.quantity + change) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
    toast.error("Produto removido");
  };

  const handleFinalize = () => {
    if (!selectedCustomer) {
      toast.info("Selecione um cliente");
      return;
    }

    if (cartItems.length === 0) {
      toast.info("Carrinho vazio");
      return;
    }

    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    if (currentOrderId) {
      storage.updateOrder(currentOrderId, {
        items: cartItems,
        total,
      });
    } else {
      const newOrder = storage.addOrder({
        customerId: selectedCustomer.id,
        customerName: selectedCustomer.name,
        items: cartItems,
        total,
        status: "aberto",
      });
      setCurrentOrderId(newOrder.id);
    }

    toast.success("Pedido salvo!");

    setCartItems([]);
    setSelectedCustomer(null);
    setCurrentOrderId(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-primary text-primary-foreground shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-6 w-6" />
              <h1 className="text-xl font-bold">Sistema de Vendas</h1>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => router.push("/historico")}
            >
              <History className="h-4 w-4 mr-2" />
              Histórico
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-6xl pb-32">
        {/* Seleção de Cliente */}
        <div className="mb-6">
          <CustomerSelector
            selectedCustomer={selectedCustomer}
            onSelectCustomer={setSelectedCustomer}
          />
        </div>

        <Separator className="my-6" />

        {/* Grid de Produtos */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Produtos</h2>
          <ProductsGrid onAddProduct={handleAddProduct} />
        </div>

        {/* Carrinho */}
        {cartItems.length > 0 && (
          <>
            <Separator className="my-6" />
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">Pedido Atual</h2>
              <div className="space-y-2">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.productId}
                    item={item}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemoveItem}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </main>

      {/* Resumo do Carrinho (fixo na parte inferior) */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto max-w-6xl">
            <CartSummary
              items={cartItems}
              onFinalize={handleFinalize}
              disabled={!selectedCustomer}
            />
          </div>
        </div>
      )}
    </div>
  );
}
