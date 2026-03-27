import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authHeader = sessionStorage.getItem('authHeader');

  if (authHeader) {
    req = req.clone({
      setHeaders: {
        Authorization: authHeader
      }
    });
  }

  return next(req);
};
