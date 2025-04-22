import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, ValidationErrors } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { OrdersService } from '../services/orders/orders.service';
import { CartService } from '../services/cart/cart.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  paymentForm!: FormGroup;
  paymentData: any;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private ordersService: OrdersService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.loadPaymentData();
    this.createForm();
  }

  loadPaymentData() {
    this.http.get<any[]>('assets/data/credencialesData.json').subscribe((data: any[]) => {
      this.paymentData = data;
    });
  }

  createForm() {
    this.paymentForm = this.fb.group({
      cardName: ['', [Validators.required]],
      cardNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{16}$/)]],
      expiryDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^[0-9]{3,4}$/)]]
    });
  }

  processPayment() {
    if (this.paymentForm.valid && this.compareData()) {
      alert('Gracias por su compra');
      this.createOrder();
    } else {
      alert('Por favor, completa el formulario correctamente:');
    }
  }

  
  compareData(): boolean {
      const formData = this.paymentForm.value;
      return this.paymentData.some((item: any) =>
        item.paymentForm.cardName === formData.cardName &&
        item.paymentForm.cardNumber === formData.cardNumber &&
        item.paymentForm.expiryDate === formData.expiryDate &&
        item.paymentForm.cvv === formData.cvv
      );
    }

  createOrder() {
    const orderItems = this.cartService.getItems().map(item => ({
      product: item.product.id_product,
      quantity: item.quantity
    }));

    if (orderItems.length === 0) {
      console.error('No hay elementos en el carrito para crear una orden');
      return;
    }

    this.ordersService.createOrder(orderItems).subscribe(
      (order: any) => {
        console.log('Orden creada:', order);
        this.cartService.clearCart();
        this.router.navigate(['/dashboard']); 
      },
      (error) => {
        console.error('Error al crear la orden:', error);
      }
    );
  }
}
