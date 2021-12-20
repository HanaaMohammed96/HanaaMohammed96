import { MatDialogRef } from '@angular/material/dialog';
import { ApiHandlerService } from '@core/services/api-handler.service';
import { finalize } from 'rxjs/operators';
import { AccountsClient, AccountDto, FullNameDto } from '@core/api';
import { IdentityManager } from '@core/auth';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
})
export class UpdateProfileComponent implements OnInit {
  form: FormGroup;

  id: string;

  account: AccountDto;

  loading = false;
  errors = { detail: null, key: null };

  constructor(
    private _accountsClient: AccountsClient,
    private _identityManager: IdentityManager,
    private _fb: FormBuilder,
    private _dialogRef: MatDialogRef<UpdateProfileComponent>,
    private _handler: ApiHandlerService
  ) {}

  get firstName(): AbstractControl {
    return this.form.get('fullName.FirstName');
  }

  get lastName(): AbstractControl {
    return this.form.get('fullName.LastName');
  }

  ngOnInit() {
    this.id = this._identityManager.user.id;

    this._accountsClient.get().subscribe((account: AccountDto) => {
      this.account = account;

      this.form = this._fb.group({
        email: [this.account.email, Validators.required],
        fullName: this._fb.group({
          FirstName: [this.account.name.firstName, Validators.required],
          LastName: [this.account.name.lastName, Validators.required],
        }),
      });
    });
  }

  submit(): void {
    const value = this.form.value;

    if (!value) {
      return;
    }

    this.loading = true;

    this._accountsClient
      .changeProfile(
        null,
        value.email,
        value.fullName.FirstName,
        value.fullName.LastName,
        null
      )
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(
        () => {
          const user = this._identityManager.account$.getValue();

          user.email = value.email;
          user.name = new FullNameDto({
            firstName: value.fullName.FirstName,
            lastName: value.fullName.LastName,
          });

          this._identityManager.account$.next(user);
          this._dialogRef.close();
        },
        (err) =>
          this._handler
            .handleError(err)
            .assignValidationErrors(this.form)
            .assignErrors(this.errors)
      );
  }
}
