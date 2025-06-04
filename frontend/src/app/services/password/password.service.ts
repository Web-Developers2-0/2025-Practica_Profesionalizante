import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { UserService } from '../user/user.service';

@Injectable({ providedIn: 'root' })
export class PasswordService {
  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) {}

  requestPasswordReset(email: string) {
    return this.http.post(`${this.baseUrl}password-reset/`, { email });
  }

  confirmPasswordReset(token: string, password: string) {
    return this.http.post(`${this.baseUrl}password-reset-confirm/${token}/`, { password });
  }

  changePassword(currentPassword: string, newPassword: string) {
    const headers = this.userService['getAuthHeaders']();
    return this.http.post(
      `${this.baseUrl}change-password/`,
      {
        current_password: currentPassword,
        new_password: newPassword
      },
      { headers }
    );
  }
}