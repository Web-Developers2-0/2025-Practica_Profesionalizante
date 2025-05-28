import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  sendContact(form: { name: string; email: string; message: string }) {
    return this.http.post(`${this.baseUrl}contact/`, form);
  }
}