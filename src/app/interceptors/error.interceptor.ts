import { HttpErrorResponse, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { catchError } from "rxjs";
import { Abstractions } from "../services/abstractions";

export function ErrorInterceptor(req: HttpRequest<any>, next: HttpHandlerFn) {
    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            Abstractions.HandleError(error);
            return next(req);
        })
    );
}