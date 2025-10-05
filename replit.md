# StockPro - Inventory Management System

## Overview

StockPro is a comprehensive inventory management system built for small to medium-sized businesses. The application provides real-time inventory tracking, stock transaction management, supplier and customer relationship management, and detailed reporting capabilities. It features a modern React frontend with a clean, intuitive interface and a robust Express.js backend with SQLite database integration.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database ORM**: Drizzle ORM for type-safe database operations
- **API Design**: RESTful API with structured error handling
- **File Structure**: Modular separation with shared schemas between client and server
- **Development**: Hot module replacement and middleware logging

### Database Schema Design
The system uses SQLite with four core entities:
- **Products**: Central inventory items with SKU, pricing, and stock levels
- **Suppliers**: Vendor management with contact information and status
- **Customers**: Customer relationship tracking
- **Stock Transactions**: Comprehensive audit trail for all inventory movements

Key architectural decisions:
- UUID primary keys for scalability and security
- Separate transaction table for detailed inventory history
- Denormalized stock quantities on products for performance
- Flexible transaction types (in/out) with detailed reasons

### Data Validation Strategy
- Shared Zod schemas between frontend and backend ensure consistency
- Type-safe form handling with automatic validation
- Database-level constraints complement application validation
- Graceful error handling with user-friendly messages

### Component Architecture
- Reusable UI components following atomic design principles
- Feature-based page organization with dedicated forms and tables
- Dashboard with real-time metrics and activity feeds
- Responsive design with mobile-first approach

## External Dependencies

### Core Dependencies
- **better-sqlite3**: Fast SQLite3 database driver for Node.js
- **drizzle-orm**: Type-safe ORM with SQLite dialect
- **@tanstack/react-query**: Server state management and caching
- **react-hook-form**: Form state management with performance optimization
- **@hookform/resolvers**: Zod integration for form validation

### UI Component Libraries
- **@radix-ui/***: Comprehensive set of accessible, unstyled UI primitives
- **lucide-react**: Modern icon library with consistent design
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe variant API for component styling

### Development Tools
- **vite**: Fast build tool and development server
- **typescript**: Static type checking
- **drizzle-kit**: Database migration and introspection tools
- **esbuild**: Fast JavaScript bundler for production builds

### Database Integration
- SQLite as the primary database stored as `sqlite.db` file
- File-based database with zero configuration
- Automatic UUID generation for primary keys using crypto.randomUUID()
- Built-in timestamp tracking for audit trails
- Text-based storage for decimal values (prices)
- Integer mode for booleans and timestamps

The system architecture prioritizes type safety, developer experience, and maintainability while providing a scalable foundation for inventory management operations.