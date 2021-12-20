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
  ServiceProvidersClient,
  ServiceProviderFullVm,
  BranchShortVm,
  ServiceVm,
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
  selector: 'app-team-create-update',
  templateUrl: './team-create-update.component.html',
})
export class TeamCreateUpdateComponent implements OnInit, OnDestroy {
  form: FormGroup;

  Role = Role;

  dto: AccountDashboardDto;

  loading = false;
  errors = { detail: null, key: null };

  serviceProviders: ServiceProviderFullVm[];
  branches: BranchShortVm[];
  services: ServiceVm[];

  isArabic = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: AdminVm,
    private _accountsClient: AccountsClient,
    private _spsClient: ServiceProvidersClient,
    private _dialogRef: MatDialogRef<TeamCreateUpdateComponent>,
    private _handler: ApiHandlerService,
    private _fb: FormBuilder,
    private _localizationService: LocalizationService
  ) {
    this.isArabic = this._localizationService.getLang() === Language.Ar;
  }

  get firstName(): AbstractControl {
    return this.form.get('name.FirstName');
  }

  get lastName(): AbstractControl {
    return this.form.get('name.LastName');
  }

  ngOnInit() {
    this._spsClient
      .getFullList()
      .subscribe((serviceProviders: ServiceProviderFullVm[]) => {
        this.serviceProviders = serviceProviders;

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
            role: ['', Validators.required],
            username: ['', Validators.required],
            serviceProviderId: [''],
            branchId: [''],
            serviceId: [''],
            pin: [''],
            password: ['', Validators.required],
            confirmPassword: ['', Validators.required],
          });

          this.onValueChanges(0, Role.Admin);
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
                role: new FormControl(
                  { value: this.dto.role || 0, disabled: true },
                  Validators.required
                ),
                username: [this.dto.username],
                serviceProviderId: [this.dto.serviceProviderId],
                branchId: [this.dto.branchId],
                serviceId: [this.dto.serviceId],
                pin: [this.dto.pin],
              });

              this.onValueChanges(this.dto.serviceProviderId, this.dto.role);
            });
        }
      });
  }

  ngOnDestroy(): void {
    this._dialogRef.close(this.data);
  }

  onValueChanges(defaultSpId: number, defaultRole: Role): void {
    const roleOnValueChanges = (value: number) => {
      const role = +value as Role;
      const username = this.form.get('username');
      const spId = this.form.get('serviceProviderId');
      const branchId = this.form.get('branchId');
      const serviceId = this.form.get('serviceId');
      const pin = this.form.get('pin');

      if (role === Role.Admin || role === Role.User) {
        username.disable();
        spId.disable();
        branchId.disable();
        serviceId.disable();
        pin.disable();
      } else if (role === Role.Service) {
        username.enable();
        spId.enable();
        branchId.enable();
        serviceId.enable();
        pin.enable();
      } else {
        if (role === Role.Counter) {
          username.enable();
          pin.enable();
        } else {
          username.disable();
          pin.disable();
        }

        spId.enable();
        branchId.enable();
        serviceId.disable();
      }
    };

    const spIdOnValueChanges = (value: number) => {
      const spId = +value;

      const sp = this.serviceProviders.find((c) => c.id === spId);

      if (!sp) {
        this.branches = [];
        this.services = [];
        return;
      }

      this.branches = sp.branches;
      this.services = sp.services;

      const branchId = this.form.get('branchId');
      const serviceId = this.form.get('serviceId');

      const branch = this.branches.find((c) => c.id === +branchId.value);

      if (branch) {
        branchId.setValue(branch.id);
      }

      const service = this.services.find((c) => c.id === +serviceId.value);

      if (service) {
        serviceId.setValue(service.id);
      }
    };

    this.form.get('role').valueChanges.subscribe(roleOnValueChanges);
    this.form.get('serviceProviderId').valueChanges.subscribe(spIdOnValueChanges);

    roleOnValueChanges(defaultRole);
    spIdOnValueChanges(defaultSpId);
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
          role: +rawValue.role as Role,
          username: value.username,
          serviceProviderId: value.serviceProviderId ? +value.serviceProviderId : null,
          branchId: value.branchId ? +value.branchId : null,
          serviceId: value.serviceId ? +value.serviceId : null,
          pin: value.pin,
          password: rawValue.password,
          confirmPassword: rawValue.confirmPassword,
        })
      );
    } else {
      action = this._accountsClient.put(
        new AccountsPutCommand({
          id: this.data.id,
          fullName,
          email: rawValue.email,
          phoneNumber,
          role: +rawValue.role as Role,
          username: value.username,
          serviceProviderId: value.serviceProviderId ? +value.serviceProviderId : null,
          branchId: value.branchId ? +value.branchId : null,
          serviceId: value.serviceId ? +value.serviceId : null,
          pin: value.pin,
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
      },
      (err) =>
        this._handler
          .handleError(err)
          .assignValidationErrors(this.form)
          .assignErrors(this.errors)
    );
  }
}
