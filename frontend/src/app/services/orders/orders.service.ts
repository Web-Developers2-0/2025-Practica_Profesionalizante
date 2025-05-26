import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { LoginService } from '../auth/login.service';
import { Order } from './order';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private loginService: LoginService) {}

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.loginService.userToken}`,
      'Content-Type': 'application/json'
    });
  }

  getUserOrders(): Observable<Order[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Order[]>(`${this.baseUrl}orders/user/`, { headers })
      .pipe(catchError(this.handleError));
  }

  createOrder(orderItems: { product: number, quantity: number }[]): Observable<Order> {
    const headers = this.getAuthHeaders();
    const orderPayload = { order_items: orderItems };
    return this.http.post<Order>(`${this.baseUrl}orders/create/`, orderPayload, { headers })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('Se ha producido un error:', error.error);
    } else if (error.status === 401) {
      console.error('No estás autenticado:', error.error);
    } else if (error.status === 403) {
      console.error('No tienes permisos para realizar esta acción:', error.error);
    } else {
      console.error(`Backend retornó el código de estado ${error.status}:`, error.error);
    }
    return throwError(() => new Error('Algo salió mal, intente nuevamente.'));
  }
}