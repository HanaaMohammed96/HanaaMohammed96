import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TokenService } from '@core/auth/services/token.service';
import { PATHS } from '@models';

export const APP_VERSION = new InjectionToken<string>('APP_VERSION');

@Injectable({
  providedIn: 'root',
})
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    @Optional() @Inject(APP_VERSION) private readonly _version: string,
    private _router: Router,
    private _route: ActivatedRoute,
    private _tokenService: TokenService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headers: any = {
      Version: this._version,
      'Accept-Language': localStorage.getItem('lang'),
      'Application-Type': 'Portal',
    };

    const token = this._tokenService.token.value;

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    req = req.clone({ setHeaders: headers });

    return next.handle(req).pipe(catchError((err) => this.handleErrorReq(err)));
  }

  private handleErrorReq(err: HttpErrorResponse): Observable<never> {
    const returnUrl = this._route.snapshot.url.reduce(
      (path, currentSegment) => `${path}/${currentSegment.path}`,
      ''
    );

    switch (err.status) {
      case 401:
        this._tokenService.clear();
        this._router.navigate([PATHS.Login], { queryParams: { returnUrl } });

        break;

      case 403:
        this._router.navigateByUrl(PATHS.Page403);
        break;

      case 500:
        this._router.navigateByUrl(PATHS.Page500);
        break;
    }

    return throwError(err);
  }
}
