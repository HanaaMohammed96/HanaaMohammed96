import { MatDialogRef } from '@angular/material/dialog';
import { ApiHandlerService } from '@core/services/api-handler.service';
import { finalize } from 'rxjs/operators';
import { AccountsClient, AccountDto, FullNameDto, ChangePhoneNumberCommand, ConfirmChangePhoneNumberCommand } from '@core/api';
import { IdentityManager } from '@core/auth';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { CountryFlagsService } from '@core/services/countryFlags.service';

@Component({
  selector: 'app-update-phone-number',
  templateUrl: './update-phone-number.component.html',
})

export class UpdatePhoneNumberComponent implements OnInit {
  form: FormGroup;

  id: string;

  timer: number = 61;

  canConfirm: boolean = false;

  account: AccountDto;

  loading = false;
  errors = { detail: null, key: null };
  code: string;

  constructor(
    private _accountsClient: AccountsClient,
    private _identityManager: IdentityManager,
    private _fb: FormBuilder,
    private _dialogRef: MatDialogRef<UpdatePhoneNumberComponent>,
    private _handler: ApiHandlerService,
    private _countryCodeService: CountryFlagsService
  ) { }

  ngOnInit() {
    this.id = this._identityManager.user.id;

    this._accountsClient.get().subscribe((account: AccountDto) => {
      this.account = account;

      const code = this._countryCodeService.getCode(account.phoneNumber);
      if(code)
        this.form = this._fb.group({
          phoneNumber: [this.account.phoneNumber.replace(code, ''), Validators.required],
          token: [''],
        });

    });
  }

  setCountryCode(event: string): void {
    this.code = event;
  }

  startTimer() {
    var interval = setInterval(() => {
      this.timer = +this.timer + 1;

      if (this.timer > 60)
        clearInterval(interval);

    }, 1000)
  }

  submit(): void {
    const value = this.form.value;

    if (!value) {
      return;
    }

    this.loading = true;
    if (!this.canConfirm)
      this._accountsClient
        .changePhoneNumber(
          new ChangePhoneNumberCommand({ phoneNumber: this.code + value.phoneNumber })
        )
        .pipe(finalize(() => (this.loading = false)))
        .subscribe(
          () => {
            this.canConfirm = true;
          },
          (err) => {
            this._handler
              .handleError(err)
              .assignValidationErrors(this.form)
              .assignErrors(this.errors)

          }
        );
    else {
      this._accountsClient
        .confirmChangedPhoneNumber(
          new ConfirmChangePhoneNumberCommand({ token: value.token })
        )
        .pipe(finalize(() => (this.loading = false)))
        .subscribe(
          () => {
            const user = this._identityManager.account$.getValue();

            user.phoneNumber = value.phoneNumber;

            this._identityManager.account$.next(user);

            this._handler.handleSuccess()
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

  resend() {
    const value = this.form.value;

    if (!value) {
      return;
    }

    this.loading = true;

    this._accountsClient
      .changePhoneNumber(
        new ChangePhoneNumberCommand({ phoneNumber: this.code + value.phoneNumber })
      )
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(
        () => {
          this.canConfirm = true;
          this.timer = 0;
          this.startTimer()
        },
        (err) => {
          this.timer = 0;
          this.startTimer();

          this._handler
            .handleError(err)
            .assignValidationErrors(this.form)
            .assignErrors(this.errors)

        }
      );
  }


}
