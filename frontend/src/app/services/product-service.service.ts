import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from './product.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductServiceService {
  private apiUrl = environment.apiUrl + 'products/';

  constructor(private http: HttpClient) {}

  obtenerProductos(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  obtenerProductoPorId(productId: number): Observable<Product> {
    const url = `${this.apiUrl}${productId}/`;
    return this.http.get<Product>(url);
  }
}

