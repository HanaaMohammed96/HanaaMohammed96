import { PATHS } from '@models';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import icVisibility from '@iconify/icons-ic/twotone-visibility';
import icVisibilityOff from '@iconify/icons-ic/twotone-visibility-off';
import { IdentityManager} from '@core/auth';
import { finalize } from 'rxjs/operators';
import { ForgetPasswordCommand } from '@core/api';
import { ApiHandlerService } from '@core/services/api-handler.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styles: [
    `
      :host {
        min-width: 25%;
      }
    `,
  ],
})
export class ForgotPasswordComponent implements OnInit {
  form: FormGroup;

  inputType = 'password';
  visible = false;

  loading = false;

  errors = { detail: null, key: null };

  icVisibility = icVisibility;
  icVisibilityOff = icVisibilityOff;

  constructor(
    private _identityManager : IdentityManager,
    private _router: Router,
    private _fb: FormBuilder,
    private _handler: ApiHandlerService
  ) {}

  ngOnInit() {
    this.form = this._fb.group({
      email: ['', Validators.required],
    });
  }

  login() {
    const value = this.form.value;

    if (!value) {
      return;
    }

    this.loading = true;
   
    this._identityManager.forgetPassword(new ForgetPasswordCommand({email : value.email}))
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(
        () => {
          this._router.navigate([`${PATHS.Validate}`], {queryParams : {emali : value.email}});
        },
        (err) => {
          this._handler
            .handleError(err)
            .assignValidationErrors(this.form)
            .assignErrors(this.errors)
        }
      );
  }
}
