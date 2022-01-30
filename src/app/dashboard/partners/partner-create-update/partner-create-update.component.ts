import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {
  AccountsClient,
  AdminVm,
  FullNameDto,
  AccountsPostCommand,
  Role,
  AccountDashboardDto,
  AccountsPutCommand,
  Language,
} from '@core/api';
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  FormControl,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiHandlerService } from '@core/services/api-handler.service';
import { LocalizationService } from '@core/services/localization.service';

@Component({
  selector: 'app-partner-create-update',
  templateUrl: './partner-create-update.component.html',
})
export class PartnerCreateUpdateComponent implements OnInit, OnDestroy {
  form: FormGroup;

  Role = Role;

  dto: AccountDashboardDto;

  loading = false;
  errors = { detail: null, key: null };

  isArabic = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: AdminVm,
    private _accountsClient: AccountsClient,
    private _dialogRef: MatDialogRef<PartnerCreateUpdateComponent>,
    private _handler: ApiHandlerService,
    private _fb: FormBuilder,
    private _localizationService: LocalizationService,
  ) {
    this.isArabic = this._localizationService.getLang() === Language.Ar;
  }
  get firstName(): AbstractControl {
    return this.form.get('name.FirstName');
  }

  get lastName(): AbstractControl {
    return this.form.get('name.LastName');
  }

  ngOnInit(): void {
    if (!this.data) {
      this.data = {} as AdminVm;
      this.dto = {} as AccountDashboardDto;

      this.form = this._fb.group({
        name: this._fb.group({
          FirstName: ['', Validators.required],
          LastName: ['', Validators.required],
        }),
        email: ['', Validators.required],
        phoneNumber: ['', Validators.required],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      });
    } else {
      this._accountsClient
        .getUser(this.data.id)
        .subscribe((account: AccountDashboardDto) => {
          this.dto = account;
          this.form = this._fb.group({
            name: this._fb.group({
              FirstName: [this.dto.name.firstName || '', Validators.required],
              LastName: [this.dto.name.lastName || '', Validators.required],
            }),
            email: new FormControl(
              { value: this.dto.email || '', disabled: true },
              Validators.required
            ),
            phoneNumber: [
              this.dto.phoneNumber
                ? this.dto.phoneNumber.replace(
                  this.dto.phoneNumber,
                  this.dto.phoneNumber.substring(4)
                )
                : '',
              Validators.required,
            ],
            username: new FormControl(
              { value: this.data.username || '', disabled: false },
              Validators.required
            ),
          });
        });
    }
  }
  ngOnDestroy(): void {
    this._dialogRef.close(this.data);
  }

  submit(): void {
    const value = this.form.value;
    const rawValue = this.form.getRawValue();
    if (!value) {
      return;
    }

    this.loading = true;

    const name = value.name.FirstName + ' ' + value.name.LastName;

    const fullName = new FullNameDto({
      firstName: value.name.FirstName,
      lastName: value.name.LastName,
    });

    let action: Observable<any>;

    const phoneNumber = rawValue.phoneNumber ? '+20 ' + rawValue.phoneNumber : null;

    if (!this.data.id) {
      action = this._accountsClient.post(
        new AccountsPostCommand({
          fullName,
          email: rawValue.email,
          phoneNumber,
          role: Role.Partner,
          password: rawValue.password,
          confirmPassword: rawValue.confirmPassword,
        })
      );
    } else {
      action = this._accountsClient.put(
        new AccountsPutCommand({
          userId: this.data.id,
          fullName,
          email: rawValue.email,
          phoneNumber,
        })
      );
    }

    action.pipe(finalize(() => (this.loading = false))).subscribe(
      (response: any) => {
        if (response) {
          this.data.id = response.id;
          this.data.username = response.username;
          this.data.createdAt = response.createdAt;
          this.data.role = +value.role as Role;
        }

        this.data.fullName = name;
        this.data.phoneNumber = phoneNumber;
        this.data.username = value.username || this.data.username;

        this._dialogRef.close();

        this._handler.handleSuccess();

      },
      (err) =>
        this._handler
          .handleError(err)
          .assignValidationErrors(this.form)
          .assignErrors(this.errors)
    );
  }
}
