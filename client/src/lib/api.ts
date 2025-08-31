import { apiRequest } from "./queryClient";
import type { 
  Product, 
  InsertProduct, 
  Supplier, 
  InsertSupplier,
  Customer,
  InsertCustomer,
  StockTransaction,
  InsertStockTransaction,
  ProductWithStock,
  StockTransactionWithDetails,
  DashboardMetrics,
  CategorySummary
} from "@shared/schema";

// Products API
export const productsApi = {
  getAll: (): Promise<Product[]> =>
    fetch("/api/products").then(res => res.json()),
  
  search: (query: string): Promise<Product[]> =>
    fetch(`/api/products/search?q=${encodeURIComponent(query)}`).then(res => res.json()),
  
  getById: (id: string): Promise<Product> =>
    fetch(`/api/products/${id}`).then(res => res.json()),
  
  create: (product: InsertProduct): Promise<Product> =>
    apiRequest("POST", "/api/products", product).then(res => res.json()),
  
  update: (id: string, product: Partial<InsertProduct>): Promise<Product> =>
    apiRequest("PUT", `/api/products/${id}`, product).then(res => res.json()),
  
  delete: (id: string): Promise<void> =>
    apiRequest("DELETE", `/api/products/${id}`).then(() => {}),
  
  getTransactions: (id: string): Promise<StockTransactionWithDetails[]> =>
    fetch(`/api/products/${id}/transactions`).then(res => res.json()),
};

// Suppliers API
export const suppliersApi = {
  getAll: (): Promise<Supplier[]> =>
    fetch("/api/suppliers").then(res => res.json()),
  
  getById: (id: string): Promise<Supplier> =>
    fetch(`/api/suppliers/${id}`).then(res => res.json()),
  
  create: (supplier: InsertSupplier): Promise<Supplier> =>
    apiRequest("POST", "/api/suppliers", supplier).then(res => res.json()),
  
  update: (id: string, supplier: Partial<InsertSupplier>): Promise<Supplier> =>
    apiRequest("PUT", `/api/suppliers/${id}`, supplier).then(res => res.json()),
  
  delete: (id: string): Promise<void> =>
    apiRequest("DELETE", `/api/suppliers/${id}`).then(() => {}),
};

// Customers API
export const customersApi = {
  getAll: (): Promise<Customer[]> =>
    fetch("/api/customers").then(res => res.json()),
  
  getById: (id: string): Promise<Customer> =>
    fetch(`/api/customers/${id}`).then(res => res.json()),
  
  create: (customer: InsertCustomer): Promise<Customer> =>
    apiRequest("POST", "/api/customers", customer).then(res => res.json()),
  
  update: (id: string, customer: Partial<InsertCustomer>): Promise<Customer> =>
    apiRequest("PUT", `/api/customers/${id}`, customer).then(res => res.json()),
  
  delete: (id: string): Promise<void> =>
    apiRequest("DELETE", `/api/customers/${id}`).then(() => {}),
};

// Stock Transactions API
export const stockTransactionsApi = {
  getAll: (): Promise<StockTransactionWithDetails[]> =>
    fetch("/api/stock-transactions").then(res => res.json()),
  
  getById: (id: string): Promise<StockTransactionWithDetails> =>
    fetch(`/api/stock-transactions/${id}`).then(res => res.json()),
  
  create: (transaction: InsertStockTransaction): Promise<StockTransaction> =>
    apiRequest("POST", "/api/stock-transactions", transaction).then(res => res.json()),
};

// Dashboard API
export const dashboardApi = {
  getMetrics: (): Promise<DashboardMetrics> =>
    fetch("/api/dashboard/metrics").then(res => res.json()),
  
  getLowStock: (): Promise<ProductWithStock[]> =>
    fetch("/api/dashboard/low-stock").then(res => res.json()),
  
  getRecentActivity: (limit?: number): Promise<StockTransactionWithDetails[]> =>
    fetch(`/api/dashboard/recent-activity${limit ? `?limit=${limit}` : ""}`).then(res => res.json()),
  
  getCategories: (): Promise<CategorySummary[]> =>
    fetch("/api/dashboard/categories").then(res => res.json()),
};

// Reports API
export const reportsApi = {
  getStockReport: (): Promise<ProductWithStock[]> =>
    fetch("/api/reports/stock").then(res => res.json()),
};
