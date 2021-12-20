import { MatDialogRef } from '@angular/material/dialog';
import { ApiHandlerService } from '@core/services/api-handler.service';
import { finalize } from 'rxjs/operators';
import { AccountsClient, ChangePasswordCommand } from '@core/api';
import { IdentityManager } from '@core/auth';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
})
export class UpdatePasswordComponent implements OnInit {
  form: FormGroup;

  id: string;

  loading = false;
  errors = { detail: null, key: null };

  constructor(
    private _accountsClient: AccountsClient,
    private _identityManager: IdentityManager,
    private _fb: FormBuilder,
    private _dialogRef: MatDialogRef<UpdatePasswordComponent>,
    private _handler: ApiHandlerService
  ) {}

  ngOnInit() {
    this.id = this._identityManager.user.id;

    this.form = this._fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  submit(): void {
    const value = this.form.value;

    if (!value) {
      return;
    }

    this.loading = true;

    this._accountsClient
      .changePassword(
        new ChangePasswordCommand({
          oldPassword: value.oldPassword,
          newPassword: value.newPassword,
          confirmPassword: value.confirmPassword,
        })
      )
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(
        () => this._dialogRef.close(),
        (err) =>
          this._handler
            .handleError(err)
            .assignValidationErrors(this.form)
            .assignErrors(this.errors)
      );
  }
}
