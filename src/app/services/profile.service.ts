import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Result, TResult } from '../../abstractions/Result';
import { UserResponse } from '../../interfaces/users/profile-response';
import { catchError, map, Observable, of } from 'rxjs';
import { Abstractions } from './abstractions';
import { UpdateProfile } from '../../interfaces/users/update-profile';
import { ChangePasswordRequest } from '../contracts/change.password';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  baseUrl = environment.apiUrl;
  constructor(private httpClient: HttpClient) { }


  getUserProfile() : Observable<TResult<UserResponse>> {
    return this.httpClient.get<UserResponse>(`${this.baseUrl}/users/profile`).pipe(
      map((response: UserResponse) => {
        return TResult.success<UserResponse>(response);
      }),
      catchError((error: HttpErrorResponse) => {
        const myError = Abstractions.HandleError(error);
        return of(TResult.fail<UserResponse>(myError));
      })
    );
  }

  updateUserProfile(updateRequest: UpdateProfile) : Observable<Result> {
    return this.httpClient.put<UpdateProfile>(`${this.baseUrl}/users/profile`, updateRequest).pipe(
      map(() => {
        return Result.success();
      }),
      catchError((error: HttpErrorResponse) => {
        const myError = Abstractions.HandleError(error);
        return of(Result.fail(myError));
      })
    );
  }

  changePassword(request: ChangePasswordRequest): Observable<Result> {
    return this.httpClient.post(`${this.baseUrl}/users/change-password`, request).pipe(
      map(() => {
        return Result.success();
      }),
      catchError((error: HttpErrorResponse) => {
        const myError = Abstractions.HandleError(error);
        return of(Result.fail(myError));
      })
    );
  } 

  deleteAccount(): Observable<Result> {
    return this.httpClient.delete(`${this.baseUrl}/users/delete`).pipe(
      map(() => {
        return Result.success();
      }),
      catchError((error: HttpErrorResponse) => {
        const myError = Abstractions.HandleError(error);
        return of(Result.fail(myError));
      })
    );
  }
}
