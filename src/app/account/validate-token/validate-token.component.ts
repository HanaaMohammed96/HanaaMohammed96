import { QUERY_PARAMETER_NAMES } from '@models';
import { PATHS } from '@models';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import icVisibility from '@iconify/icons-ic/twotone-visibility';
import icVisibilityOff from '@iconify/icons-ic/twotone-visibility-off';
import { finalize } from 'rxjs/operators';
import { AccountsClient, ForgetPasswordCommand, ValidateResetPasswordToken } from '@core/api';
import { AuthResult, IdentityManager } from '@core/auth';

@Component({
  selector: 'app-validate-token',
  templateUrl: './validate-token.component.html',
  styles: [
    `
      :host {
        min-width: 25%;
      }
    `,
  ],
})

export class ValidateTokenComponent implements OnInit {
  form: FormGroup;

  timer: number = 61;
  interval;

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
  ) { }

  ngOnInit() {
    this.form = this._fb.group({
      token: ['', Validators.required],
    });
  }

  startTimer() {
    this.interval = setInterval(() => {
      this.timer = +this.timer + 1;

      if (this.timer > 60)
        clearInterval(this.interval);

    }, 1000)
  }

  Send() {
    const value = this.form.value;

    if (!value) {
      return;
    }

    this.loading = true;

    const email =
      this._route.snapshot.queryParams[QUERY_PARAMETER_NAMES.Eamil];

    this._identityManager.validateToken(new ValidateResetPasswordToken({ email: email, token: value.token }))
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(
        () => {
          this._router.navigate([PATHS.ChangePassword], {queryParams : {emali : email, token : value.token }});
        },
        (err) =>{

          this.errors.detail = err.detail;
          console.log(err)
        }
      );
  }

  resend() {
    const email =
      this._route.snapshot.queryParams[QUERY_PARAMETER_NAMES.Eamil];

    this._identityManager.forgetPassword(new ForgetPasswordCommand({ email: email }))
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(
        () => {
          this.timer = 0;
          this.startTimer()
        },
        (err) =>{
          this.timer = 0;
          this.startTimer();
          this.errors.detail = err.detail;
        }
      );
  }
}
