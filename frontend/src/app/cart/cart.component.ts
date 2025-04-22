import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart/cart.service';
import { Router } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  standalone: true,
  imports: [RouterLink, RouterModule, RouterLinkActive, NgIf, CommonModule]
})
export class CartComponent implements OnInit {
  items = this.cartService.getItems();

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.items = this.cartService.getItems();
  }

  goToPayment() {
    this.router.navigate(['/payment']);
  }

  getTotal(): number {
    // Calcular el precio total sumando el precio de cada ítem multiplicado por su cantidad
    return this.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }
}
