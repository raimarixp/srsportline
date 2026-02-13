import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product, ProductVariant } from '../types/product';

export interface CartItem {
  id: string; // ID único do item no carrinho (produtoId + variante)
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, variant: ProductVariant) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Carregar do LocalStorage ao iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem('sr_cart');
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  // Salvar no LocalStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('sr_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, variant: ProductVariant) => {
    const uniqueId = `${product.id}-${variant.size}`;
    
    setItems(current => {
      const existingItem = current.find(item => item.id === uniqueId);
      if (existingItem) {
        return current.map(item => 
          item.id === uniqueId 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...current, { id: uniqueId, product, variant, quantity: 1 }];
    });
    setIsCartOpen(true); // Abre o carrinho automaticamente
  };

  const removeFromCart = (itemId: string) => {
    setItems(current => current.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    setItems(current => 
      current.map(item => item.id === itemId ? { ...item, quantity } : item)
    );
  };

  const clearCart = () => setItems([]);

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ 
      items, addToCart, removeFromCart, updateQuantity, clearCart, 
      cartCount, cartTotal, isCartOpen, setIsCartOpen 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);