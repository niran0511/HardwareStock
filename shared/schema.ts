import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const products = sqliteTable("products", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  category: text("category").notNull(),
  price: text("price").notNull().default("0.00"),
  quantity: integer("quantity").notNull().default(0),
  reorderLevel: integer("reorder_level").notNull(),
  description: text("description"),
});

export const suppliers = sqliteTable("suppliers", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  isActive: integer("is_active", { mode: 'boolean' }).notNull().default(true),
});

export const customers = sqliteTable("customers", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
});

export const stockTransactions = sqliteTable("stock_transactions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  productId: text("product_id").notNull(),
  type: text("type").notNull(), // 'in' or 'out'
  reason: text("reason").notNull(), // 'purchase', 'sale', 'return', 'wastage', 'adjustment'
  quantity: integer("quantity").notNull(),
  unitPrice: text("unit_price"),
  totalValue: text("total_value"),
  supplierId: text("supplier_id"),
  customerId: text("customer_id"),
  notes: text("notes"),
  timestamp: integer("timestamp", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Insert schemas
export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

export const insertSupplierSchema = createInsertSchema(suppliers).omit({
  id: true,
});

export const insertCustomerSchema = createInsertSchema(customers).omit({
  id: true,
});

export const insertStockTransactionSchema = createInsertSchema(stockTransactions).omit({
  id: true,
  timestamp: true,
});

// Types
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Supplier = typeof suppliers.$inferSelect;
export type InsertSupplier = z.infer<typeof insertSupplierSchema>;

export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;

export type StockTransaction = typeof stockTransactions.$inferSelect;
export type InsertStockTransaction = z.infer<typeof insertStockTransactionSchema>;

// Extended types for API responses
export type ProductWithStock = Product & {
  stockStatus: 'in-stock' | 'low-stock' | 'out-of-stock';
};

export type StockTransactionWithDetails = StockTransaction & {
  productName: string;
  productSku: string;
  supplierName?: string;
  customerName?: string;
};

export type DashboardMetrics = {
  totalProducts: number;
  lowStockCount: number;
  totalStockValue: number;
  activeSuppliers: number;
};

export type CategorySummary = {
  category: string;
  productCount: number;
  totalValue: number;
  growth: number;
};
