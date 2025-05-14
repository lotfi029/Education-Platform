import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { RegisterResponse } from '../../interfaces/auths/RegisterResponse';
import { RegisterRequest } from "../../interfaces/auths/RegisterRequest";
import { TResult } from '../../abstractions/Result';
import { MyError } from '../../abstractions/Error';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _authUrl = `${environment.apiUrl}/auths`;
  constructor(private _httpClient: HttpClient) { }

  register(request: RegisterRequest): Observable<TResult<RegisterResponse>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this._httpClient.post<RegisterResponse>(
      `${this._authUrl}/register`,
      request,
      {
        observe: 'response',
        headers: headers
      }
    ).pipe(
      map((response: HttpResponse<RegisterResponse>) => {
        console.log('Registration successful:', response.body);
          return TResult.success(response.body) as TResult<RegisterResponse>;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error during registration:', error);
        const message = error.error?.message || 'An error occurred during registration';
        return of(TResult.fail(new MyError(message, error.status)) as TResult<RegisterResponse>);
      })
    );
  }
}