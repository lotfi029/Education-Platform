import { HttpErrorResponse } from "@angular/common/http";
import { MyError } from "../../abstractions/Error";

export class Abstractions {

    static HandleError(error: HttpErrorResponse): MyError {
        let arr: string[] = [];
        if (error.error) {
        if (Array.isArray(error.error.Errors)) {
            arr = error.error.Errors.filter((e: any) => typeof e === 'string');
        } else if (typeof error.error.message === 'string') {
            arr = [error.error.message];
        } else if (typeof error.error === 'string') {
            arr = [error.error];
        } else if (error.error.detail) {
            arr = [error.error.detail];
        }
        }

        if (arr.length === 0) {
        arr = ['An unexpected error occurred. Please try again.'];
        }

        let myError: MyError;
        switch (error.status) {
        case 400:
            myError = MyError.BadRequest(arr);
            break;
        case 401:
            myError = MyError.Unauthorized(arr);
            break;
        case 403:
            myError = MyError.Forbidden(arr);
            break;
        case 404:
            myError = MyError.NotFound(arr);
            break;
        case 409:
            myError = MyError.Conflict(arr);
            break;
        default:
            myError = MyError.InternalServerError(arr);
        }
        return myError;
  }
}