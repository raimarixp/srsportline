// src/types/product.ts

export interface ProductVariant {
  id?: string;
  size: string;
  stock: number;
  sku: string;
}

// 👇 O erro acontece se faltar o "export" aqui na frente
export interface Product {
  id?: string;
  
  // Dados Básicos
  name: string;
  slug: string;
  description: string;
  price: number;
  compare_at_price?: number;
  images: string[];
  
  // Filtros
  category: string;
  brand: string;
  team?: string;
  league?: string;
  continent?: string;
  gender?: 'Masculino' | 'Feminino' | 'Unissex';
  
  // 📦 LOGÍSTICA (Crucial para o erro não acontecer no Checkout)
  weight: number;
  height: number;
  width: number;
  length: number;

  variants: ProductVariant[];
  featured: boolean;
  
  created_at?: string;
  updated_at?: string;
}