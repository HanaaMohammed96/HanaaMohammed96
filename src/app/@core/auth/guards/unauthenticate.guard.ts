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
import { PATHS } from '@models';

@Injectable({
  providedIn: 'root',
})
export class UnauthenticatedGuard implements CanActivate, CanLoad {
  constructor(private _identityManager: IdentityManager, private _router: Router) {}

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> {
    return this.handle(segments);
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.handle(next.url);
  }

  handle(segments: UrlSegment[]): Observable<boolean> {
    const user = this._identityManager.user;

    const authorized = !!user && !segments.map((s) => s.path).includes('logout');

    if (authorized) {
      this._router.navigate([PATHS.Home]);
    }

    return of(!authorized);
  }
}
