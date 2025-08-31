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
  type CategorySummary,
  products,
  suppliers,
  customers,
  stockTransactions
} from "@shared/schema";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, sql, desc } from "drizzle-orm";
import { randomUUID } from "crypto";

const client = neon(process.env.DATABASE_URL!);
const db = drizzle(client);

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

export class DatabaseStorage implements IStorage {
  constructor() {}

  // Products

  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const result = await db.select().from(products).where(eq(products.id, id));
    return result[0];
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    // Auto-generate SKU if not provided
    const sku = insertProduct.sku || `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    
    const productData = {
      ...insertProduct,
      sku,
      reorderLevel: insertProduct.reorderLevel || 10, // Default reorder level
      description: insertProduct.description || null
    };
    const result = await db.insert(products).values(productData).returning();
    return result[0];
  }

  async updateProduct(id: string, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    const updateData = {
      ...updates,
      ...(updates.description !== undefined && { description: updates.description || null })
    };
    const result = await db.update(products).set(updateData).where(eq(products.id, id)).returning();
    return result[0];
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id)).returning();
    return result.length > 0;
  }

  async searchProducts(query: string): Promise<Product[]> {
    const lowercaseQuery = `%${query.toLowerCase()}%`;
    return await db.select().from(products).where(
      sql`LOWER(${products.name}) LIKE ${lowercaseQuery} OR LOWER(${products.sku}) LIKE ${lowercaseQuery} OR LOWER(${products.category}) LIKE ${lowercaseQuery}`
    );
  }

  async getProductsBySku(sku: string): Promise<Product | undefined> {
    const result = await db.select().from(products).where(eq(products.sku, sku));
    return result[0];
  }

  // Suppliers
  async getSuppliers(): Promise<Supplier[]> {
    return await db.select().from(suppliers);
  }

  async getSupplier(id: string): Promise<Supplier | undefined> {
    const result = await db.select().from(suppliers).where(eq(suppliers.id, id));
    return result[0];
  }

  async createSupplier(insertSupplier: InsertSupplier): Promise<Supplier> {
    const supplierData = {
      ...insertSupplier,
      email: insertSupplier.email || null,
      phone: insertSupplier.phone || null,
      address: insertSupplier.address || null
    };
    const result = await db.insert(suppliers).values(supplierData).returning();
    return result[0];
  }

  async updateSupplier(id: string, updates: Partial<InsertSupplier>): Promise<Supplier | undefined> {
    const updateData = {
      ...updates,
      ...(updates.email !== undefined && { email: updates.email || null }),
      ...(updates.phone !== undefined && { phone: updates.phone || null }),
      ...(updates.address !== undefined && { address: updates.address || null })
    };
    const result = await db.update(suppliers).set(updateData).where(eq(suppliers.id, id)).returning();
    return result[0];
  }

  async deleteSupplier(id: string): Promise<boolean> {
    const result = await db.delete(suppliers).where(eq(suppliers.id, id)).returning();
    return result.length > 0;
  }

  // Customers
  async getCustomers(): Promise<Customer[]> {
    return await db.select().from(customers);
  }

  async getCustomer(id: string): Promise<Customer | undefined> {
    const result = await db.select().from(customers).where(eq(customers.id, id));
    return result[0];
  }

  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const customerData = {
      ...insertCustomer,
      email: insertCustomer.email || null,
      phone: insertCustomer.phone || null,
      address: insertCustomer.address || null
    };
    const result = await db.insert(customers).values(customerData).returning();
    return result[0];
  }

  async updateCustomer(id: string, updates: Partial<InsertCustomer>): Promise<Customer | undefined> {
    const updateData = {
      ...updates,
      ...(updates.email !== undefined && { email: updates.email || null }),
      ...(updates.phone !== undefined && { phone: updates.phone || null }),
      ...(updates.address !== undefined && { address: updates.address || null })
    };
    const result = await db.update(customers).set(updateData).where(eq(customers.id, id)).returning();
    return result[0];
  }

  async deleteCustomer(id: string): Promise<boolean> {
    const result = await db.delete(customers).where(eq(customers.id, id)).returning();
    return result.length > 0;
  }

  // Stock Transactions
  async getStockTransactions(): Promise<StockTransactionWithDetails[]> {
    const transactions = await db.select().from(stockTransactions).orderBy(desc(stockTransactions.timestamp));
    return this.enrichTransactions(transactions);
  }

  async getStockTransaction(id: string): Promise<StockTransactionWithDetails | undefined> {
    const result = await db.select().from(stockTransactions).where(eq(stockTransactions.id, id));
    if (!result[0]) return undefined;
    
    const enriched = await this.enrichTransactions([result[0]]);
    return enriched[0];
  }

  async createStockTransaction(insertTransaction: InsertStockTransaction): Promise<StockTransaction> {
    const transactionData = {
      ...insertTransaction,
      unitPrice: insertTransaction.unitPrice || null,
      totalValue: insertTransaction.totalValue || null,
      supplierId: insertTransaction.supplierId || null,
      customerId: insertTransaction.customerId || null,
      notes: insertTransaction.notes || null
    };
    
    const result = await db.insert(stockTransactions).values(transactionData).returning();
    const transaction = result[0];
    
    // Update product quantity
    await this.updateProductQuantity(transaction.productId, transaction.type, transaction.quantity);
    
    return transaction;
  }

  async getStockTransactionsByProduct(productId: string): Promise<StockTransactionWithDetails[]> {
    const transactions = await db.select().from(stockTransactions)
      .where(eq(stockTransactions.productId, productId))
      .orderBy(desc(stockTransactions.timestamp));
    return this.enrichTransactions(transactions);
  }

  // Dashboard & Reports
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const allProducts = await db.select().from(products);
    const allSuppliers = await db.select().from(suppliers);
    
    const totalProducts = allProducts.length;
    const lowStockCount = allProducts.filter(p => p.quantity <= p.reorderLevel).length;
    const totalStockValue = allProducts.reduce((sum, p) => sum + (parseFloat(p.price) * p.quantity), 0);
    const activeSuppliers = allSuppliers.filter(s => s.isActive).length;

    return {
      totalProducts,
      lowStockCount,
      totalStockValue,
      activeSuppliers
    };
  }

  async getLowStockProducts(): Promise<ProductWithStock[]> {
    const allProducts = await db.select().from(products);
    return allProducts
      .filter(p => p.quantity <= p.reorderLevel)
      .map(p => ({
        ...p,
        stockStatus: this.getStockStatus(p)
      }));
  }

  async getRecentActivity(limit: number = 10): Promise<StockTransactionWithDetails[]> {
    const transactions = await db.select().from(stockTransactions)
      .orderBy(desc(stockTransactions.timestamp))
      .limit(limit);
    
    return this.enrichTransactions(transactions);
  }

  async getCategorySummary(): Promise<CategorySummary[]> {
    const allProducts = await db.select().from(products);
    const categoryMap = new Map<string, { count: number; value: number }>();

    allProducts.forEach(p => {
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
    const allProducts = await db.select().from(products);
    return allProducts.map(p => ({
      ...p,
      stockStatus: this.getStockStatus(p)
    }));
  }

  // Helper methods
  private async enrichTransactions(transactions: StockTransaction[]): Promise<StockTransactionWithDetails[]> {
    const enriched: StockTransactionWithDetails[] = [];
    
    for (const t of transactions) {
      const product = await this.getProduct(t.productId);
      let supplier: Supplier | undefined;
      let customer: Customer | undefined;
      
      if (t.supplierId) {
        supplier = await this.getSupplier(t.supplierId);
      }
      
      if (t.customerId) {
        customer = await this.getCustomer(t.customerId);
      }

      enriched.push({
        ...t,
        productName: product?.name || 'Unknown Product',
        productSku: product?.sku || 'Unknown SKU',
        supplierName: supplier?.name,
        customerName: customer?.name
      });
    }
    
    return enriched;
  }

  private async updateProductQuantity(productId: string, type: string, quantity: number): Promise<void> {
    const product = await this.getProduct(productId);
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

export const storage = new DatabaseStorage();
