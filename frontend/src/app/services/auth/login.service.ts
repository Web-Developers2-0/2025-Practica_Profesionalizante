import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from './login.request';
import { Observable, BehaviorSubject, tap, catchError, throwError, map } from 'rxjs';
import { jwtDecode } from "jwt-decode";
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class LoginService {
  private token : string = '';
  // private headers: HttpHeaders;
  private baseUrl: string = environment.apiUrl;
  
  currentUserLogin: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  currentUserData: BehaviorSubject<String> = new BehaviorSubject<String>('');
  
  constructor(private http: HttpClient) { 
    this.token = localStorage.getItem('token') || '';
    // this.headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'Authorization': `Bearer ${this.token}`
    // });

    this.currentUserLogin.next(localStorage.getItem('token') !== null);
    this.currentUserData.next(localStorage.getItem('token') || '');
  }

  methodlogin(credentials: LoginRequest):Observable<any>{
    
    return this.http.post<any>(`${this.baseUrl}login/`, credentials).pipe(
      
    tap((userData) => {
        this.token = userData.token;
        localStorage.setItem('token', userData.token);
        this.currentUserData.next(userData.token);
        this.currentUserLogin.next(true);
      }),
      map((userData) => userData.token),
      catchError(this.handleError)
    );
  }
  methodlogout(): void {
    localStorage.removeItem('token');
    this.token = '';
    // this.headers = new HttpHeaders({
    //   'Content-Type': 'application/json'
    // });
    this.currentUserLogin.next(false);
    this.currentUserData.next('');
  }

  private handleError(error:HttpErrorResponse){
    if(error.status === 0){
      console.error('Se ha producido un error', error.error);
    }else{
      console.error(`Backend retorno el código de estado: `, error.status, error.error);
    }
    return throwError(() => new Error('Algo salio mal, intente nuevamente'));
  }

  get userData(): Observable<String> {
    return this.currentUserData.asObservable();
  }

  get userLogin(): Observable<boolean> {
    return this.currentUserLogin.asObservable();
  }

  get userToken():String{
    return this.token;
  }

  isValidToken(): boolean {
    try{
      const decodedToken = jwtDecode(this.token);
      const currentTime = Date.now() / 1000;
      return decodedToken.exp !== undefined && decodedToken.exp > currentTime;
    }catch(error){
      return false;
    }
  }
}