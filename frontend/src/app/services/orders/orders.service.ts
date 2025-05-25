import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Si usas autenticación, agrega aquí el token
  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
      // 'Authorization': `Bearer ${token}`
    });
  }

  getUserOrders(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.baseUrl}orders/user/`, { headers })
      .pipe(catchError(this.handleError));
  }

  createOrder(orderItems: { product: number, quantity: number }[]): Observable<any> {
    const headers = this.getAuthHeaders();
    const orderPayload = { order_items: orderItems };
    return this.http.post<any>(`${this.baseUrl}orders/create/`, orderPayload, { headers })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('Se ha producido un error:', error.error);
    } else {
      console.error(`Backend retornó el código de estado ${error.status}:`, error.error);
    }
    return throwError(() => new Error('Algo salió mal, intente nuevamente.'));
  }
}