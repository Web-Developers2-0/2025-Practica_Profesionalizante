import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginService } from '../auth/login.service';

export interface Notificacion {
  id: number;
  usuario: number;
  mensaje: string;
  tipo: string;
  leida: boolean;
  fecha: string;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private loginService: LoginService) {}

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.loginService.userToken}`,
      'Content-Type': 'application/json',
    });
  }

  getNotificaciones(): Observable<Notificacion[]> {
    return this.http
      .get<Notificacion[]>(`${this.baseUrl}notifications/`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('Se ha producido un error:', error.error);
    } else {
      console.error(`Backend retornó ${error.status}:`, error.error);
    }
    return throwError(() => new Error('Error al obtener notificaciones.'));
  }
}
