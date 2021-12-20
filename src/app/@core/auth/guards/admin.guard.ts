import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanLoad,
  Route,
} from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IdentityManager } from '../services/identity-manager.service';
import { PATHS } from '@models';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate, CanLoad {
  constructor(private _identityManager: IdentityManager, private _router: Router) {}

  canLoad(route: Route): Observable<boolean> {
    return this.handle();
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.handle();
  }

  private handle(): Observable<boolean> {
    const user = this._identityManager.user;

    if (user && user.isAdmin) {
      return of(true);
    }

    this._router.navigate([PATHS.Page404]);

    return of(false);
  }
}
