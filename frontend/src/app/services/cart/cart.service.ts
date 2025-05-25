import { Injectable } from '@angular/core';
import { Compras, Product } from '../product.interface';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private items: Compras[] = [];
  private itemsSubject = new BehaviorSubject<Compras[]>([]);
  cartItems$ = this.itemsSubject.asObservable();

  constructor() {}

  addToCart(product: Product, quantity: number) {
    const existingItem = this.items.find(item => item.product.id_product === product.id_product);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({ product, quantity });
    }
    this.itemsSubject.next([...this.items]);
    console.log("Producto añadido al carrito:", product.name);
    console.log("Estado del carrito:", this.items);
  }

  getItems() {
    return this.items;
  }

  limpiarCarrito(): void {
    this.items = [];
    this.itemsSubject.next([...this.items]);
    console.log('Carrito limpiado');
  }

  delete(item: Compras) {
    this.items = this.items.filter(i => i.product.id_product !== item.product.id_product);
    this.itemsSubject.next([...this.items]);
  }

  clearCart() {
    this.items = [];
    this.itemsSubject.next([...this.items]);
  }

  updateItems(items: Compras[]): void {
    this.items = items;
    this.itemsSubject.next([...this.items]);
  }

  removeFromCart(product: Product, quantity: number) {
    const existingItemIndex = this.items.findIndex(item => item.product.id_product === product.id_product);

    if (existingItemIndex !== -1) {
      const existingItem = this.items[existingItemIndex];
      existingItem.quantity -= quantity;

      if (existingItem.quantity <= 0) {
        this.items.splice(existingItemIndex, 1);
      }
      this.itemsSubject.next([...this.items]);
    }
  }
}