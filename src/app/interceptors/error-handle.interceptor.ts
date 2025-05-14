import { HttpInterceptorFn } from '@angular/common/http';

export const errorHandleInterceptor: HttpInterceptorFn = (req, next) => {


  return next(req);
};
