import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import dashboardData from '../../assets/data/dashboardData.json';
import { LoginService } from '../services/auth/login.service';;
import { Router } from '@angular/router';
import { User } from '../services/user/user';
import { UserService } from '../services/user/user.service';
import { OrdersService } from '../services/orders/orders.service';
import { Order } from '../services/orders/order';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  dashboardData: any[] = [];
  isAuthenticated:boolean = false;
  userOrders: Order[] = [];
  
  user: User = {
    id: 0,
    email: '',
    first_name: '',
    last_name: '',
    address: '',
    phone: 0,
    password: '',
    confirmPassword: '',
  };
 
  constructor(private loginService: LoginService, private router: Router, private userService: UserService, private ordersService: OrdersService) {
    this.dashboardData = dashboardData;
  }

  ngOnInit(): void {
    this.userService.getUser(1).subscribe(
      (userData: User) => {
        this.user = userData;
      },
    )
    
    this.loginService.userLogin.subscribe((isAuthenticated) => {
      this.isAuthenticated = this.isAuthenticated;
    });

    this.getUserOrders();
  }

  getUserOrders() {
    this.ordersService.getUserOrders().subscribe(
      (ordersData: any[]) => {
        this.userOrders = ordersData.map((orderData: any) => ({
          id_order: orderData.id_order,
          user: orderData.user,
          state: orderData.state,
          order_date: orderData.order_date,
          payment_method: orderData.payment_method,
          shipping_method: orderData.shipping_method,
          payment_status: orderData.payment_status,
          total_amount: orderData.total_amount,
          order_items: orderData.order_items
        }));
      },
    );
  }

  logout() {
    this.loginService.methodlogout();
    this.isAuthenticated = false;
    this.router.navigate(['/']);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }
} 