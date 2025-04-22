import { Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule, NgIf} from '@angular/common';
import { Router, RouterLink, RouterModule,RouterLinkActive } from '@angular/router';
import { ProductsComponent } from '../../products/products.component';
import { LoginService } from '../../services/auth/login.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink,RouterModule,RouterLinkActive,NgIf, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy{
  isLoggedIn: boolean = false;

  constructor(private loginService: LoginService){}

  ngOnDestroy(): void {
    this.loginService.currentUserLogin.unsubscribe();
  }

  ngOnInit(): void {
    this.loginService.currentUserLogin.subscribe(
    {
      next:(isLoggedIn) => {
        this.isLoggedIn = isLoggedIn;
      }
    });
  }
}