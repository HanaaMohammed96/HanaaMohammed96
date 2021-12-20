import { TranslateService } from '@ngx-translate/core';
import { PATHS } from '@models';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ProblemDetails, ValidationProblemDetails } from '../api';
import { HttpResult } from '@models/http-result';

@Injectable({
  providedIn: 'root',
})
export class ApiHandlerService {
  constructor(
    private _toastr: ToastrService,
    private _translateService: TranslateService,
    private _router: Router
  ) {}

  handleError(err: ProblemDetails | ValidationProblemDetails): HttpResult {
    if (!err.hasOwnProperty('status')) {
      this.handleAny();
    }

    switch (err.status) {
      case 404:
        return this.handle404(err);
      case 400:
        return this.handle400(err);
      case 422:
        return this.handle422(err as ValidationProblemDetails);
      case 405:
      case 505:
        return this.handleUnsupportedVersion();
      default:
        return this.handleAny();
    }
  }

  private handle404(err: ProblemDetails): HttpResult {
    this._toastr.error(err.detail);

    this._router.navigate([PATHS.Page404]);

    return this.createHttpResult(null);
  }

  private handle422(err: ValidationProblemDetails): HttpResult {
    if (err.errors && Object.keys(err.errors).length < 1) {
      return this.createHttpResult('errors.err422');
    }

    return this.createHttpResult(err);
  }

  private handle400(err: ProblemDetails): HttpResult {
    return this.createHttpResult(err);
  }

  private handleUnsupportedVersion(): HttpResult {
    return this.createHttpResult('errors.version');
  }

  private handleAny(): HttpResult {
    return this.createHttpResult('errors.general');
  }

  private createHttpResult(error: any): HttpResult {
    return new HttpResult(error, this._toastr, this._translateService);
  }
}
