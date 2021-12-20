import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ValidationProblemDetails, ProblemDetails } from '@core/api';
import { AbstractControl, FormGroup, FormArray } from '@angular/forms';

export class HttpResult {
  private _validationErrors: { [key: string]: string[] } = {};
  private _error: string = null;
  private _errorKey: string = null;
  private _notFound = false;

  constructor(
    error: ProblemDetails | ValidationProblemDetails | string,
    private _toastr: ToastrService,
    private _translate: TranslateService
  ) {
    if (!error) {
      this._notFound = true;
    } else if (typeof error === 'string') {
      this._errorKey = error;
    } else if (error instanceof ValidationProblemDetails) {
      const err = (error as ValidationProblemDetails).errors;

      for (const e in err) {
        if (err.hasOwnProperty(e) && err[e] && err[e].length > 0) {
          this._validationErrors[e] = err[e];
        }
      }
    } else {
      const details = error as ProblemDetails;

      this._error = details.detail;
    }
  }

  /** Flag indicating whether the response not found. */
  get notFound(): boolean {
    return this._notFound;
  }

  /** Returns the validation errors if request failed or null if succeeded */
  assignValidationErrors(form: FormGroup): HttpResult {
    Object.keys(form.controls).forEach((key) => {
      form.get(key).setErrors(null);
    });

    for (const err in this._validationErrors) {
      if (this._validationErrors.hasOwnProperty(err)) {
        if (this._validationErrors[err] && this._validationErrors[err].length > 0) {
          if (err.includes('[')) {
            const parts = err.split('.');

            let control: AbstractControl = form;

            for (const part of parts) {
              const match = part.match(/(\w*)(?:\[)(\d)(?:\])/);

              if (match) {
                const array = control.get(match[1]) as FormArray;
                control = array.controls[+match[2]];
              } else {
                control = control.get(part);
              }
            }

            control.setErrors({
              validation: this._validationErrors[err][0],
            });
          } else {
            form.get(err).setErrors({
              validation: this._validationErrors[err][0],
            });
          }
        }
      }
    }

    return this;
  }

  /** Returns the bad request errors if request failed */
  assignErrors(errors: { detail: string; key: string }): HttpResult {
    errors.detail = this._error;
    errors.key = this._errorKey;
    return this;
  }

  async pushError(): Promise<any> {
    if (!this._toastr || !this._translate) {
      return;
    }

    if (this.notFound) {
      return;
    } else if (this._error) {
      this._toastr.error(this._error);
    } else if (this._errorKey) {
      this._toastr.error(await this._translate.get(this._errorKey).toPromise());
    } else {
      this._toastr.error(await this._translate.get('errors.general').toPromise());
    }
  }
}
