import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  CanLoad,
  Route,
  UrlSegment,
} from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IdentityManager } from '../services/identity-manager.service';
import { PATHS, QUERY_PARAMETER_NAMES } from '@models';

@Injectable({
  providedIn: 'root',
})
export class AuthorizeGuard implements CanActivate, CanLoad {
  constructor(private _identityManager: IdentityManager, private _router: Router) {}

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> {
    const returnUrl = segments.reduce(
      (path, currentSegment) => `${path}/${currentSegment.path}`,
      ''
    );

    return this.handle(returnUrl);
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.handle(state.url);
  }

  private handle(returnUrl: string): Observable<boolean> {
    const user = this._identityManager.user;

    const authorized = !!user;
    
    if (!authorized) {
      this._router.navigate([PATHS.Login], {
        queryParams: {
          [QUERY_PARAMETER_NAMES.ReturnUrl]: !!returnUrl ? returnUrl : null,
        },
      });
    }

    return of(authorized);
  }
}
