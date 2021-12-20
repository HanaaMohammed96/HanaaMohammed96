import { QUERY_PARAMETER_NAMES } from '@models';
import { PATHS } from '@models';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import icVisibility from '@iconify/icons-ic/twotone-visibility';
import icVisibilityOff from '@iconify/icons-ic/twotone-visibility-off';
import { IdentityManager, AuthResult } from '@core/auth';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
    `
      :host {
        min-width: 25%;
      }
    `,
  ],
})
export class LoginComponent implements OnInit {
  form: FormGroup;

  inputType = 'password';
  visible = false;

  loading = false;

  errors = { detail: null, key: null };

  icVisibility = icVisibility;
  icVisibilityOff = icVisibilityOff;

  constructor(
    private _identityManager: IdentityManager,
    private _route: ActivatedRoute,
    private _router: Router,
    private _fb: FormBuilder
  ) {}

  ngOnInit() {
    this.form = this._fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [''],
    });
  }

  login() {
    const value = this.form.value;

    if (!value) {
      return;
    }

    this.loading = true;

    this._identityManager
      .login(value.email, value.password, value.rememberMe)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(
        () => {
          const returnUrl =
            this._route.snapshot.queryParams[QUERY_PARAMETER_NAMES.ReturnUrl];

          if (returnUrl) {
            this._router.navigateByUrl(returnUrl);
          } else {
            this._router.navigate([PATHS.Home]);
          }
        },
        (err: AuthResult) =>
          err.result.assignValidationErrors(this.form).assignErrors(this.errors)
      );
  }

  toggleVisibility() {
    if (this.visible) {
      this.inputType = 'password';
      this.visible = false;
    } else {
      this.inputType = 'text';
      this.visible = true;
    }
  }
}
