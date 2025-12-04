"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { storage, type Customer } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus, Users } from "lucide-react";

interface CustomerSelectorProps {
  selectedCustomer: Customer | null;
  onSelectCustomer: (customer: Customer) => void;
}

export function CustomerSelector({
  selectedCustomer,
  onSelectCustomer,
}: CustomerSelectorProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");

  useEffect(() => {
    setCustomers(storage.getCustomers());
  }, []);

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerName.trim()) return;

    const customer = storage.addCustomer({
      name: newCustomerName.trim(),
      phone: newCustomerPhone.trim() || undefined,
    });

    setCustomers(storage.getCustomers());
    onSelectCustomer(customer);
    setNewCustomerName("");
    setNewCustomerPhone("");
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold">Cliente</Label>

      <div className="flex gap-2">
        <Select
          value={selectedCustomer?.id}
          onValueChange={(id) => {
            const customer = customers.find((c) => c.id === id);
            if (customer) onSelectCustomer(customer);
          }}
        >
          <SelectTrigger className="flex-1 h-12">
            <SelectValue placeholder="Selecione um cliente" />
          </SelectTrigger>
          <SelectContent>
            {customers.map((customer) => (
              <SelectItem key={customer.id} value={customer.id}>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{customer.name}</span>
                  {customer.phone && (
                    <span className="text-xs text-muted-foreground">
                      ({customer.phone})
                    </span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              className="h-12 w-12 shrink-0 bg-transparent"
            >
              <UserPlus className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Cliente</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddCustomer} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  placeholder="Nome do cliente"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone (opcional)</Label>
                <Input
                  id="phone"
                  value={newCustomerPhone}
                  onChange={(e) => setNewCustomerPhone(e.target.value)}
                  placeholder="(00) 00000-0000"
                  type="tel"
                />
              </div>
              <Button type="submit" className="w-full">
                Adicionar Cliente
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {selectedCustomer && (
        <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
          <p className="text-sm font-medium">
            Cliente selecionado:{" "}
            <span className="font-bold">{selectedCustomer.name}</span>
          </p>
          {selectedCustomer.phone && (
            <p className="text-xs text-muted-foreground mt-1">
              Telefone: {selectedCustomer.phone}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
