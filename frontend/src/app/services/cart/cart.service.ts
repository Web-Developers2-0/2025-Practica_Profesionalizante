import { Injectable } from '@angular/core';
import { Compras, Product } from '../product.interface';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private items: Compras[] = [];

  constructor() {}

  addToCart(product: Product, quantity: number) {
    const existingItem = this.items.find(item => item.product.id_product === product.id_product);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({ product, quantity });
    }
    console.log("Producto añadido al carrito:", product.name);
    console.log("Estado del carrito:", this.items);
  }

  getItems() {
    return this.items;
  }

  limpiarCarrito(): void {
    this.items = [];
    console.log('Carrito limpiado');
  }

  delete(item: Compras) {
    this.items = this.items.filter(i => i.product.id_product !== item.product.id_product);
  }

  clearCart() {
    this.items = [];
  }
  removeFromCart(product: Product, quantity: number) {
    const existingItemIndex = this.items.findIndex(item => item.product.id_product === product.id_product);

    if (existingItemIndex !== -1) {
      const existingItem = this.items[existingItemIndex];
      existingItem.quantity -= quantity;

      if (existingItem.quantity <= 0) {
        // Si la cantidad restante es menor o igual a cero, eliminar el producto del carrito
        this.items.splice(existingItemIndex, 1);
      }
    }
}}
