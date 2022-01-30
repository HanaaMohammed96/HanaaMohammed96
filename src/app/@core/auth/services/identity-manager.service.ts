import { SocialStorageService } from './social-storage.service';
import { SocialUser } from 'angularx-social-login';
import {
  AccountsClient,
  LoginCommand,
  AuthResponse,
  RefreshTokenCommand,
  AccountDto,
  ExternalLoginCommand,
  ExternalRegisterCommand,
  ForgetPasswordCommand,
  ResetPasswordCommand,
  ValidateResetPasswordToken,
} from '@core/api';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { PATHS } from '@models';
import { TokenService } from './token.service';
import { AuthToken, ITokenPayload, Role } from './token';
import { AuthResult } from './auth-result';
import { ApiHandlerService } from '@core/services/api-handler.service';

export class User {
  id: string;
  userName: string;
  fullName?: string;
  email: string;
  phoneNumber: string;
  created?: Date;
  picture?: string;
  roles?: Role | Role[];
  isAdmin: boolean;

  constructor(payload: ITokenPayload) {
    this.id = payload.sub;
    this.userName = payload.name;
    this.fullName = payload.fullName;
    this.email = payload.email;
    this.phoneNumber = payload.phoneNumber;
    this.created = new Date(payload.created);
    this.roles = payload.roles;
    this.isAdmin = payload.roles.includes('Admin');
  }
}

@Injectable({
  providedIn: 'root',
})
export class IdentityManager {
  public account$: BehaviorSubject<AccountDto> = new BehaviorSubject<AccountDto>(null);

  private _tokenExpirationTimer: any;

  constructor(
    private readonly _accountsClient: AccountsClient,
    private readonly _tokenService: TokenService,
    private readonly _router: Router,
    private readonly _handler: ApiHandlerService
  ) {
    const path = location.pathname;
    const match = path.match('/account/.*');

    if (!match || match.length === 0) {
      this.initAccount();
    }
  }

  get user(): User {
    return this._tokenService.token.payload
      ? new User(this._tokenService.token.payload)
      : null;
  }

  public refreshToken(): Observable<AuthResult> {
    return this.processResultToken(
      this._accountsClient.refreshToken(
        new RefreshTokenCommand({ refreshToken: this._tokenService.refreshToken })
      ),
      true
    ).pipe(
      tap((result: AuthResult) => {
        if (result.result) {
          this.logout(true);
        }
      })
    );
  }

  public login(
    email: string,
    password: string,
    rememberMe: boolean
  ): Observable<AuthResult> {
    return this.processResultToken(
      this._accountsClient.login(new LoginCommand({ email, password })),
      rememberMe
    );
  }

  public resetPassword(command : ResetPasswordCommand){
    return this.processResultToken(
      this._accountsClient.resetPassword(command),
      false
    );
  }

  public externalLogin(user: SocialUser, rememberMe: boolean): Observable<AuthResult> {
    return this.processResultToken(
      this._accountsClient.externalLogin(
        new ExternalLoginCommand({
          provider: user.provider,
          token: user.idToken ? user.idToken : user.authToken,
        })
      ),
      rememberMe
    ).pipe(
      catchError((err: AuthResult) => {
        SocialStorageService.set(user);
        return throwError(err);
      })
    );
  }

  public externalRegistration(phoneNumber: string): Observable<string> {
    const user = SocialStorageService.get();

    return this._accountsClient
      .externalRegistration(
        new ExternalRegisterCommand({
          provider: user.provider,
          token: user.idToken ? user.idToken : user.authToken,
          phoneNumber,
        })
      )
      .pipe(
        tap(() => {
          SocialStorageService.clear();
        }),
        map((response) => {
          return response.result;
        })
      );
  }

  public logout(navigate: boolean): void {
    clearTimeout(this._tokenExpirationTimer);

    this._tokenService.clear();

    if (navigate) {
      const currentUrl = this._router.url;

      if (currentUrl.includes(PATHS.Logout)) {
        this._router.navigate([PATHS.Login]);
      } else {
        this._router.navigate([PATHS.Login], {
          queryParams: { returnUrl: this._router.url },
        });
      }
    }
  }

  public forgetPassword(command : ForgetPasswordCommand){
    return this._accountsClient.forgetPassword(command);
  }

  public validateToken(command : ValidateResetPasswordToken){
    return this._accountsClient.validateToken(command);
  }

  /** Precess result. Save token if success result. Set logout timer */
  private processResultToken(
    tokenObservable: Observable<AuthResponse>,
    rememberMe: boolean
  ): Observable<AuthResult> {
    return tokenObservable.pipe(
      map((token) => new AuthToken(token)),
      tap((authToken) => this.authorize(authToken, rememberMe)),
      map((authToken) => new AuthResult(new User(authToken.payload), null)),
      catchError((err) => {
        return throwError(new AuthResult(null, this._handler.handleError(err)));
      })
    );
  }

  private authorize(authToken: AuthToken, rememberMe: boolean): void {
    if (!authToken) {
      this._tokenService.clear();
      return;
    }

    this._tokenService.set(authToken);

    this.initAccount();

    this._tokenExpirationTimer = setTimeout(() => {
      if (rememberMe) {
        this.refreshToken();
      } else {
        this.logout(true);
      }
    }, 24 * 60 * 60 * 1000);
  }

  private initAccount(): void {
    this._accountsClient
      .get()
      .subscribe((account: AccountDto) => this.account$.next(account));
  }

}
