import { finalize } from 'rxjs/operators';
import {
  AccountsClient,
  AdminVm,
  Role,
  AccountDashboardDto,
  ResetUserPasswordCommand,
} from '@core/api';
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiHandlerService } from '@core/services/api-handler.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';


@UntilDestroy()
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  form: FormGroup;

  Role = Role;

  loading = false;
  errors = { detail: null, key: null };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: AdminVm,
    private _accountsClient: AccountsClient,
    private _dialogRef: MatDialogRef<ResetPasswordComponent>,
    private _handler: ApiHandlerService,
    private _fb: FormBuilder
  ) {}

  ngOnInit() {
    this.form = this._fb.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  ngOnDestroy(): void {
    this._dialogRef.close(this.data);
  }

  submit(): void {
    const value = this.form.value;

    if (!value) {
      return;
    }

    this.loading = true;

    this._accountsClient
      .resetUserPassword(
        new ResetUserPasswordCommand({
          accountId: this.data.id,
          password: value.password,
          confirmPassword: value.confirmPassword,
        })
      )
      .pipe(finalize(() => (this.loading = false)), untilDestroyed(this))
      .subscribe(
        () => {
          this._dialogRef.close();
          this._handler.handleSuccess()
        },
        (err) =>
          this._handler
            .handleError(err)
            .assignValidationErrors(this.form)
            .assignErrors(this.errors)
      );
  }
}
