import { 
  type Product, 
  type InsertProduct,
  type Supplier,
  type InsertSupplier,
  type Customer,
  type InsertCustomer,
  type StockTransaction,
  type InsertStockTransaction,
  type ProductWithStock,
  type StockTransactionWithDetails,
  type DashboardMetrics,
  type CategorySummary
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;
  searchProducts(query: string): Promise<Product[]>;
  getProductsBySku(sku: string): Promise<Product | undefined>;
  
  // Suppliers
  getSuppliers(): Promise<Supplier[]>;
  getSupplier(id: string): Promise<Supplier | undefined>;
  createSupplier(supplier: InsertSupplier): Promise<Supplier>;
  updateSupplier(id: string, supplier: Partial<InsertSupplier>): Promise<Supplier | undefined>;
  deleteSupplier(id: string): Promise<boolean>;
  
  // Customers
  getCustomers(): Promise<Customer[]>;
  getCustomer(id: string): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: string, customer: Partial<InsertCustomer>): Promise<Customer | undefined>;
  deleteCustomer(id: string): Promise<boolean>;
  
  // Stock Transactions
  getStockTransactions(): Promise<StockTransactionWithDetails[]>;
  getStockTransaction(id: string): Promise<StockTransactionWithDetails | undefined>;
  createStockTransaction(transaction: InsertStockTransaction): Promise<StockTransaction>;
  getStockTransactionsByProduct(productId: string): Promise<StockTransactionWithDetails[]>;
  
  // Dashboard & Reports
  getDashboardMetrics(): Promise<DashboardMetrics>;
  getLowStockProducts(): Promise<ProductWithStock[]>;
  getRecentActivity(limit?: number): Promise<StockTransactionWithDetails[]>;
  getCategorySummary(): Promise<CategorySummary[]>;
  getStockReport(): Promise<ProductWithStock[]>;
}

export class MemStorage implements IStorage {
  private products: Map<string, Product>;
  private suppliers: Map<string, Supplier>;
  private customers: Map<string, Customer>;
  private stockTransactions: Map<string, StockTransaction>;

  constructor() {
    this.products = new Map();
    this.suppliers = new Map();
    this.customers = new Map();
    this.stockTransactions = new Map();
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    const existing = this.products.get(id);
    if (!existing) return undefined;
    
    const updated: Product = { ...existing, ...updates };
    this.products.set(id, updated);
    return updated;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  async searchProducts(query: string): Promise<Product[]> {
    const products = Array.from(this.products.values());
    const lowercaseQuery = query.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(lowercaseQuery) ||
      p.sku.toLowerCase().includes(lowercaseQuery) ||
      p.category.toLowerCase().includes(lowercaseQuery)
    );
  }

  async getProductsBySku(sku: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(p => p.sku === sku);
  }

  // Suppliers
  async getSuppliers(): Promise<Supplier[]> {
    return Array.from(this.suppliers.values());
  }

  async getSupplier(id: string): Promise<Supplier | undefined> {
    return this.suppliers.get(id);
  }

  async createSupplier(insertSupplier: InsertSupplier): Promise<Supplier> {
    const id = randomUUID();
    const supplier: Supplier = { ...insertSupplier, id };
    this.suppliers.set(id, supplier);
    return supplier;
  }

  async updateSupplier(id: string, updates: Partial<InsertSupplier>): Promise<Supplier | undefined> {
    const existing = this.suppliers.get(id);
    if (!existing) return undefined;
    
    const updated: Supplier = { ...existing, ...updates };
    this.suppliers.set(id, updated);
    return updated;
  }

  async deleteSupplier(id: string): Promise<boolean> {
    return this.suppliers.delete(id);
  }

  // Customers
  async getCustomers(): Promise<Customer[]> {
    return Array.from(this.customers.values());
  }

  async getCustomer(id: string): Promise<Customer | undefined> {
    return this.customers.get(id);
  }

  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const id = randomUUID();
    const customer: Customer = { ...insertCustomer, id };
    this.customers.set(id, customer);
    return customer;
  }

  async updateCustomer(id: string, updates: Partial<InsertCustomer>): Promise<Customer | undefined> {
    const existing = this.customers.get(id);
    if (!existing) return undefined;
    
    const updated: Customer = { ...existing, ...updates };
    this.customers.set(id, updated);
    return updated;
  }

  async deleteCustomer(id: string): Promise<boolean> {
    return this.customers.delete(id);
  }

  // Stock Transactions
  async getStockTransactions(): Promise<StockTransactionWithDetails[]> {
    const transactions = Array.from(this.stockTransactions.values());
    return this.enrichTransactions(transactions);
  }

  async getStockTransaction(id: string): Promise<StockTransactionWithDetails | undefined> {
    const transaction = this.stockTransactions.get(id);
    if (!transaction) return undefined;
    
    const enriched = await this.enrichTransactions([transaction]);
    return enriched[0];
  }

  async createStockTransaction(insertTransaction: InsertStockTransaction): Promise<StockTransaction> {
    const id = randomUUID();
    const transaction: StockTransaction = { 
      ...insertTransaction, 
      id,
      timestamp: new Date()
    };
    this.stockTransactions.set(id, transaction);
    
    // Update product quantity
    await this.updateProductQuantity(transaction.productId, transaction.type, transaction.quantity);
    
    return transaction;
  }

  async getStockTransactionsByProduct(productId: string): Promise<StockTransactionWithDetails[]> {
    const transactions = Array.from(this.stockTransactions.values())
      .filter(t => t.productId === productId);
    return this.enrichTransactions(transactions);
  }

  // Dashboard & Reports
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const products = Array.from(this.products.values());
    const suppliers = Array.from(this.suppliers.values());
    
    const totalProducts = products.length;
    const lowStockCount = products.filter(p => p.quantity <= p.reorderLevel).length;
    const totalStockValue = products.reduce((sum, p) => sum + (parseFloat(p.price) * p.quantity), 0);
    const activeSuppliers = suppliers.filter(s => s.isActive).length;

    return {
      totalProducts,
      lowStockCount,
      totalStockValue,
      activeSuppliers
    };
  }

  async getLowStockProducts(): Promise<ProductWithStock[]> {
    const products = Array.from(this.products.values());
    return products
      .filter(p => p.quantity <= p.reorderLevel)
      .map(p => ({
        ...p,
        stockStatus: this.getStockStatus(p)
      }));
  }

  async getRecentActivity(limit: number = 10): Promise<StockTransactionWithDetails[]> {
    const transactions = Array.from(this.stockTransactions.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
    
    return this.enrichTransactions(transactions);
  }

  async getCategorySummary(): Promise<CategorySummary[]> {
    const products = Array.from(this.products.values());
    const categoryMap = new Map<string, { count: number; value: number }>();

    products.forEach(p => {
      const existing = categoryMap.get(p.category) || { count: 0, value: 0 };
      categoryMap.set(p.category, {
        count: existing.count + 1,
        value: existing.value + (parseFloat(p.price) * p.quantity)
      });
    });

    return Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      productCount: data.count,
      totalValue: data.value,
      growth: Math.random() * 20 - 5 // Mock growth calculation
    }));
  }

  async getStockReport(): Promise<ProductWithStock[]> {
    const products = Array.from(this.products.values());
    return products.map(p => ({
      ...p,
      stockStatus: this.getStockStatus(p)
    }));
  }

  // Helper methods
  private async enrichTransactions(transactions: StockTransaction[]): Promise<StockTransactionWithDetails[]> {
    return transactions.map(t => {
      const product = this.products.get(t.productId);
      const supplier = t.supplierId ? this.suppliers.get(t.supplierId) : undefined;
      const customer = t.customerId ? this.customers.get(t.customerId) : undefined;

      return {
        ...t,
        productName: product?.name || 'Unknown Product',
        productSku: product?.sku || 'Unknown SKU',
        supplierName: supplier?.name,
        customerName: customer?.name
      };
    });
  }

  private async updateProductQuantity(productId: string, type: string, quantity: number): Promise<void> {
    const product = this.products.get(productId);
    if (!product) return;

    const adjustment = type === 'in' ? quantity : -quantity;
    const newQuantity = Math.max(0, product.quantity + adjustment);
    
    await this.updateProduct(productId, { quantity: newQuantity });
  }

  private getStockStatus(product: Product): 'in-stock' | 'low-stock' | 'out-of-stock' {
    if (product.quantity === 0) return 'out-of-stock';
    if (product.quantity <= product.reorderLevel) return 'low-stock';
    return 'in-stock';
  }
}

export const storage = new MemStorage();
