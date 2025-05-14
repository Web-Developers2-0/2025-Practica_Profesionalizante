import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from './login.request';
import {
  Observable,
  BehaviorSubject,
  tap,
  catchError,
  throwError,
  map,
} from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private accessToken: string = '';
  private refreshToken: string = '';
  private baseUrl: string = environment.apiUrl;

  currentUserLogin: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  currentUserData: BehaviorSubject<String> = new BehaviorSubject<String>('');

  constructor(private http: HttpClient, private router: Router) {
    this.accessToken = localStorage.getItem('accessToken') || '';
    this.refreshToken = localStorage.getItem('refreshToken') || '';
    console.log('Access Token from LocalStorage:', this.accessToken);
    console.log('Refresh Token from LocalStorage:', this.refreshToken);

    const isLoggedIn = !!this.accessToken;
    this.currentUserLogin.next(isLoggedIn);
    this.currentUserData.next(this.accessToken);
  }

  methodlogin(credentials: LoginRequest): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}login/`, credentials).pipe(
      tap((userData) => {
        console.log('Access Token received:', userData.token);
        console.log('Refresh Token received:', userData['refresh-token']);

        this.accessToken = userData.token;
        this.refreshToken = userData['refresh-token'];

        localStorage.setItem('accessToken', userData.token);
        localStorage.setItem('refreshToken', userData['refresh-token']);

        this.currentUserData.next(userData.token);
        this.currentUserLogin.next(true);
      }),
      map((userData) => userData.token),
      catchError(this.handleError)
    );
  }
  methodlogout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.accessToken = '';
    this.refreshToken = '';
    this.currentUserLogin.next(false);
    this.currentUserData.next('');
    this.router.navigate(['/login']);
  }

  updateAccessToken(token: string) {
    this.accessToken = token;
    localStorage.setItem('accessToken', token);
  }

  refreshTokenRequest(): Observable<any> {
    const payload = { refresh: this.refreshToken };
    return this.http.post<any>(`${this.baseUrl}refresh-token/`, payload).pipe(
      tap((userData) => {
        console.log('New Access Token received:', userData.access);
        console.log('New Refresh Token received:', userData.refresh);

        this.updateAccessToken(userData.access);
        this.refreshToken = userData.refresh;
        localStorage.setItem('accessToken', userData.access);
        localStorage.setItem('refreshToken', userData.refresh);
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('Se ha producido un error', error.error);
    } else {
      console.error(
        `Backend retorno el código de estado: `,
        error.status,
        error.error
      );
    }
    return throwError(() => new Error('Algo salio mal, intente nuevamente'));
  }

  isValidToken(): boolean {
    try {
      const decodedToken = jwtDecode(this.accessToken);
      const currentTime = Date.now() / 1000;
      return decodedToken.exp !== undefined && decodedToken.exp > currentTime;
    } catch (error) {
      return false;
    }
  }

  get userData(): Observable<String> {
    return this.currentUserData.asObservable();
  }

  get userLogin(): Observable<boolean> {
    return this.currentUserLogin.asObservable();
  }

  get userToken(): String {
    return this.accessToken;
  }

  get isRefreshTokenValid(): boolean {
    try {
      const decodedRefreshToken = jwtDecode(this.refreshToken);
      const currentTime = Date.now() / 1000;
      return (
        decodedRefreshToken.exp !== undefined &&
        decodedRefreshToken.exp > currentTime
      );
    } catch (error) {
      return false;
    }
  }
}
