import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from './product.interface';
@Injectable({
  providedIn: 'root'
})
export class ProductServiceService {
  private apiUrl = 'http://127.0.0.1:8000/api/products/';

  constructor(private http: HttpClient) {}

  obtenerProductos(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  obtenerProductoPorId(productId: number): Observable<Product> {
    const url = `${this.apiUrl}${productId}/`;
    return this.http.get<Product>(url);
  }
}



