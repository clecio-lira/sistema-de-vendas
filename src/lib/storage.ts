// Sistema de armazenamento local para funcionar offline
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

export interface Customer {
  id: string;
  name: string;
  phone?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  createdAt: string;
  status: "aberto" | "fechado";
}

// Produtos padrão
const defaultProducts: Product[] = [
  { id: "1", name: "Cerveja Brahma", price: 6.0, category: "Bebida" },
  { id: "2", name: "Cerveja Budweiser", price: 7.0, category: "Bebida" },
  { id: "3", name: "Cerveja Heineken", price: 8.0, category: "Bebida" },
  { id: "4", name: "Cerveja Itaipava", price: 6.0, category: "Bebida" },

  { id: "5", name: "Dobradinha", price: 10.0, category: "Tira Gosto" },
  { id: "6", name: "Dose de Dreher", price: 3.0, category: "Bebida" },
  { id: "7", name: "Dose Temperada", price: 3.0, category: "Bebida" },

  { id: "8", name: "Espetinho de Boi", price: 5.0, category: "Petisco" },
  { id: "9", name: "Espetinho de Calabresa", price: 5.0, category: "Petisco" },
  { id: "10", name: "Espetinho de Coração", price: 5.0, category: "Petisco" },
  { id: "11", name: "Espetinho de Frango", price: 5.0, category: "Petisco" },
  {
    id: "12",
    name: "Espetinho de Linguiça de Frango",
    price: 5.0,
    category: "Petisco",
  },
  { id: "13", name: "Espetinho de Porco", price: 5.0, category: "Petisco" },
  { id: "14", name: "Espetinho de Queijo", price: 5.0, category: "Petisco" },
  {
    id: "15",
    name: "Espetinho Medalhão Bacon/Boi",
    price: 5.0,
    category: "Petisco",
  },
  {
    id: "16",
    name: "Espetinho Medalhão Bacon/Frango",
    price: 5.0,
    category: "Petisco",
  },
  { id: "17", name: "Espetinho Mistão", price: 5.0, category: "Petisco" },
  {
    id: "18",
    name: "Espetinho Queijo com Bacon",
    price: 5.0,
    category: "Petisco",
  },

  { id: "19", name: "Feijoada", price: 10.0, category: "Tira Gosto" },
  { id: "20", name: "Feijoada Completa", price: 15.0, category: "Tira Gosto" },
  { id: "21", name: "Mocotó", price: 10.0, category: "Tira Gosto" },

  { id: "22", name: "Pitu", price: 7.0, category: "Bebida" },
  { id: "23", name: "Pitu Limão", price: 7.0, category: "Bebida" },
  { id: "24", name: "Pitu Limão e Mel", price: 10.0, category: "Bebida" },

  {
    id: "25",
    name: "Refrigerante Santa Joana",
    price: 2.5,
    category: "Bebida",
  },

  { id: "26", name: "Vaca Atolada", price: 10.0, category: "Tira Gosto" },
  { id: "27", name: "Vatapá", price: 10.0, category: "Tira Gosto" },
];

// LocalStorage helpers
export const storage = {
  // Produtos
  getProducts: (): Product[] => {
    if (typeof window === "undefined") return defaultProducts;
    const stored = localStorage.getItem("products");
    return stored ? JSON.parse(stored) : defaultProducts;
  },

  saveProducts: (products: Product[]) => {
    localStorage.setItem("products", JSON.stringify(products));
  },

  // Clientes
  getCustomers: (): Customer[] => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem("customers");
    return stored ? JSON.parse(stored) : [];
  },

  saveCustomers: (customers: Customer[]) => {
    localStorage.setItem("customers", JSON.stringify(customers));
  },

  addCustomer: (customer: Omit<Customer, "id">): Customer => {
    const customers = storage.getCustomers();
    const newCustomer = { ...customer, id: Date.now().toString() };
    customers.push(newCustomer);
    storage.saveCustomers(customers);
    return newCustomer;
  },

  // Pedidos
  getOrders: (): Order[] => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem("orders");
    return stored ? JSON.parse(stored) : [];
  },

  saveOrders: (orders: Order[]) => {
    localStorage.setItem("orders", JSON.stringify(orders));
  },

  getOpenOrderByCustomer: (customerId: string): Order | null => {
    if (typeof window === "undefined") return null;
    const orders = storage.getOrders();
    const openOrder = orders.find(
      (o) => o.customerId === customerId && o.status === "aberto"
    );
    return openOrder || null;
  },

  addOrder: (order: Omit<Order, "id" | "createdAt">): Order => {
    const orders = storage.getOrders();
    const openOrder = orders.find(
      (o) => o.customerId === order.customerId && o.status === "aberto"
    );
    if (openOrder) {
      // Se já existe um pedido aberto para o cliente, atualize-o
      const updatedOrder = {
        ...openOrder,
        ...order,
        createdAt: new Date().toISOString(),
      };
      const index = orders.findIndex((o) => o.id === openOrder.id);
      if (index !== -1) {
        orders[index] = updatedOrder;
      }
      storage.saveOrders(orders);
      return updatedOrder;
    } else {
      // Caso contrário, crie um novo pedido
      const newOrder = {
        ...order,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      orders.push(newOrder);
      storage.saveOrders(orders);
      return newOrder;
    }
  },

  updateOrder: (orderId: string, updates: Partial<Order>) => {
    const orders = storage.getOrders();
    const index = orders.findIndex((o) => o.id === orderId);
    if (index !== -1) {
      const order = orders[index];
      orders[index] = { ...order, ...updates };
      storage.saveOrders(orders);

      if (updates.status === "fechado") {
        const customers = storage.getCustomers();
        const filteredCustomers = customers.filter(
          (c) => c.id !== order.customerId
        );
        storage.saveCustomers(filteredCustomers);
      }

      if (updates.status === "aberto") {
        const customers = storage.getCustomers();
        const customerExists = customers.some((c) => c.id === order.customerId);
        if (!customerExists) {
          // Recria o cliente com as informações do pedido
          customers.push({
            id: order.customerId,
            name: order.customerName,
          });
          storage.saveCustomers(customers);
        }
      }
    }
  },

  deleteOrder: (orderId: string) => {
    const orders = storage.getOrders();
    const filteredOrders = orders.filter((o) => o.id !== orderId);
    storage.saveOrders(filteredOrders);
  },

  cleanOldOrders: () => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("orders");
    if (!stored) return;

    const orders: Order[] = JSON.parse(stored);
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const recentOrders = orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate > twoDaysAgo;
    });

    if (recentOrders.length !== orders.length) {
      storage.saveOrders(recentOrders);
    }
  },

  // Inicializar produtos padrão se não existir
  initializeDefaults: () => {
    if (typeof window === "undefined") return;

    if (!localStorage.getItem("products")) {
      storage.saveProducts(defaultProducts);
    }

    storage.cleanOldOrders();
  },
};
