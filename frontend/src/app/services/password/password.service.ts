import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PasswordService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  requestPasswordReset(email: string) {
    return this.http.post(`${this.baseUrl}password-reset/`, { email });
  }

  confirmPasswordReset(token: string, password: string) {
    return this.http.post(`${this.baseUrl}password-reset-confirm/${token}/`, { password });
  }
}
