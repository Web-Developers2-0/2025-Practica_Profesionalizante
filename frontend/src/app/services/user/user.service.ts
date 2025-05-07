import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from './user';
import { JwtService } from '../auth/jwt.service';
import { LoginService } from '../auth/login.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private JwtService: JwtService,
    private loginService: LoginService
  ) { }

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.loginService.userToken}`
    });
  }

  getUser(id: number): Observable<User> {
    const headers = this.getAuthHeaders();
    return this.http.get<User>(`${this.baseUrl}user/`, { headers });
  }

  updateUser(user: FormData): Observable<any> {
    const headers = this.getAuthHeaders();
  
    // No agregamos 'Content-Type', Angular lo hace automáticamente con FormData
    return this.http.patch(`${this.baseUrl}user/`, user, { headers }).pipe(
      catchError(this.handleError)
    );
  }
  

  registerUser(user: User): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}register/`, user).pipe(
      catchError(this.handleError)
    );
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
