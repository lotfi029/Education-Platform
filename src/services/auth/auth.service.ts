import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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


  getToken(request: any) : Observable<any> {
    return new Observable<any>(observer => {
      this._httpClient.post(`${this._authUrl}/get-token`, request, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        })
      }).subscribe({
        next: (res) => observer.next(res),
        error: (err) => observer.error(err),
        complete: () => observer.complete()
      });
    });
  }

  register(request: RegisterRequest) : Observable<TResult<RegisterResponse>> {
    return new Observable<TResult<any>>(observable => {
      this._httpClient.post(`${this._authUrl}/register`, request, {
        observe: 'response'
      }).subscribe({
        next: (response) => {
          if (response.status >= 200 && response.status < 300) {
            observable.next(TResult.success(response.body));
          } else {
            observable.error(TResult.fail(new MyError(response.statusText, response.status)));
          }
        },
        error: (err) => observable.error(err),
        complete: () => observable.complete()
      });
    });
  }
}