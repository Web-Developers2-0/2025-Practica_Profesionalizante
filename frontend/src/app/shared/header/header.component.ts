import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { Router, RouterLink, RouterModule, RouterLinkActive } from '@angular/router';
import { LoginService } from '../../services/auth/login.service';
import { CartService } from '../../services/cart/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterModule, RouterLinkActive, NgIf, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  totalCartItems: number = 0;
  private cartSub!: Subscription;
  private loginSub!: Subscription;

  constructor(
    private loginService: LoginService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loginSub = this.loginService.currentUserLogin.subscribe({
      next: (isLoggedIn) => {
        this.isLoggedIn = isLoggedIn;
      }
    });

    this.cartSub = this.cartService.cartItems$.subscribe(items => {
      this.totalCartItems = items.reduce((total, item) => total + item.quantity, 0);
    });
  }

  ngOnDestroy(): void {
    if (this.loginSub) this.loginSub.unsubscribe();
    if (this.cartSub) this.cartSub.unsubscribe();
  }
}