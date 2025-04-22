import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {

  constructor(private http: HttpClient) { }

  registerUser(user: any): Observable<any> {
    return this.http.post<any>('http://127.0.0.1:8000/api/register/', user).pipe(
      catchError(this.handleError)
    )
  }


  private handleError(error:HttpErrorResponse){
    if(error.status === 0){
      console.error('Se ha producido un error', error.error);
    }else{
      console.error(`Backend retorno el código de estado: `, error.status, error.error);
    }
    return throwError(() => new Error('Algo salio mal, intente nuevamente'));
  }
}
