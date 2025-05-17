import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Result, TResult } from '../../abstractions/Result';
import { MyError } from '../../abstractions/Error';
import { RegisterRequest } from '../../interfaces/auths/RegisterRequest';
import { ConfirmEmailRequest } from '../../interfaces/auths/RegisterResponse';
import { loginRequest } from '../../interfaces/auths/loginRequest';
import { authResponse } from '../../interfaces/auths/authResponse';
import { Abstractions } from './abstractions';

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  createdAt: string;
  lastLogin: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}
  
  register(registerRequest: RegisterRequest): Observable<Result> {
    return this.http.post<ConfirmEmailRequest>(`${this.apiUrl}/register`, registerRequest).pipe(
      map((response: ConfirmEmailRequest) => {
        console.log(response);
        this.confirmEmail(response).subscribe( {
          next: () => Result.success(),
          error: (error: MyError) => Result.fail(error)
        });
        return Result.success();
      }),
      catchError((error: HttpErrorResponse) => {
        const myError = Abstractions.HandleError(error);
        return of(Result.fail(myError));
      })
    );
  }
  confirmEmail(request: ConfirmEmailRequest): Observable<Result> {
    return this.http.post(`${this.apiUrl}/confirm`, request).pipe(
      map(() => {
        return Result.success();
      }),
      catchError((error: HttpErrorResponse) => {
        const myError = Abstractions.HandleError(error);
        return of(Result.fail(myError));
      })
    );
  }

  login(request: loginRequest): Observable<TResult<authResponse>> {
    return this.http.post<authResponse>(`${this.apiUrl}/token`, request).pipe(
      map((resposne: authResponse) => {
        this.setTokenToSessionStorage(resposne.accessToken, resposne.expiresIn);
        return TResult.success<authResponse>(resposne);
      }),
      catchError((error: HttpErrorResponse) => {
        const myError = Abstractions.HandleError(error);
        return of(TResult.fail<authResponse>(myError));
      })
    );
  }

  getUserProfile(): Observable<TResult<UserProfile>> {
    return this.http.get<UserProfile>(`${this.apiUrl}/api/user/profile`).pipe(
      map((response: UserProfile) => {
        return TResult.success<UserProfile>(response);
      }),
      catchError((error: HttpErrorResponse) => {
        const myError = Abstractions.HandleError(error);
        return of(TResult.fail<UserProfile>(myError));
      })
    );
  }

  logout(): void {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;

  }
  setTokenToSessionStorage(token: string, expiresIn: number): void {
    const expirationDate = new Date();
    expirationDate.setMinutes(expirationDate.getMinutes() + expiresIn);
    // document.cookie = `token=${token}; expires=${expirationDate.toUTCString()}; path=/;`;
    localStorage.setItem('token', token);
    localStorage.setItem('expiresIn', expirationDate.toString());
  }
  getToken(): string | null {
    // const cookies = document.cookie.split(';');
    // const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
    // return tokenCookie ? tokenCookie.split('=')[1] : null;


    return localStorage.getItem('token') ? localStorage.getItem('token') : null;
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(userId: string, code: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, { userId, code, password });
  }
} 