import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart/cart.service';
import { Router } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  standalone: true,
  imports: [RouterLink, RouterModule, RouterLinkActive, NgIf, CommonModule, FormsModule]
})
export class CartComponent implements OnInit {
  items = this.cartService.getItems();
  showStockWarning: boolean[] = [];

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.items = this.cartService.getItems();
    // Elimina productos sin stock
    this.items = this.items.filter(item => item.product.stock > 0);
    this.cartService.updateItems(this.items);
    this.showStockWarning = this.items.map(() => false);
  }

  hasInvalidQuantity(): boolean {
    return this.items.some(item => !item.quantity || item.quantity < 1 ||item.quantity > item.product.stock
   );
}

  decrementQuantity(index: number): void {
    if (this.items[index].quantity > 1) {
      this.items[index].quantity--;
      this.cartService.updateItems(this.items);
    } else {
      this.removeItem(index);
    }
    this.showStockWarning[index] = false;
  }

  incrementQuantity(index: number): void {
    if (this.items[index].quantity < this.items[index].product.stock) {
      this.items[index].quantity++;
      this.cartService.updateItems(this.items);
      this.showStockWarning[index] = false;
    } else {
      this.showStockWarning[index] = true;
      setTimeout(() => this.showStockWarning[index] = false, 2000);
    }
  }

  onQuantityInput(index: number, event: any): void {
    let qty = Number(event.target.value);
    const stock = this.items[index].product.stock;
    if (qty < 1) qty = 1;
    if (qty > stock) {
      qty = stock;
      this.showStockWarning[index] = true;
      setTimeout(() => this.showStockWarning[index] = false, 2000);
    } else {
      this.showStockWarning[index] = false;
    }
    this.items[index].quantity = qty;
    this.cartService.updateItems(this.items);
  }

  removeItem(index: number): void {
    this.items.splice(index, 1);
    this.cartService.updateItems(this.items);
    this.showStockWarning.splice(index, 1);
  }

  goToPayment(): void {
    this.router.navigate(['/payment']);
  }

  getTotal(): number {
    // Calcular el precio total sumando el precio de cada ítem multiplicado por su cantidad
    return this.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }
}

