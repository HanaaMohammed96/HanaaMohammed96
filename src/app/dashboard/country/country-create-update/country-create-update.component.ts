import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CountriesClient, CountriesPostCommand, CountriesPutCommand, CountryDto, LocalizedStringDto } from '@core/api';
import { ApiHandlerService } from '@core/services/api-handler.service';

@Component({
  selector: 'app-country-create-update',
  templateUrl: './country-create-update.component.html',
})
export class CountryCreateUpdateComponent implements OnInit {

  form: FormGroup;

  isActive  = {isActive : false};

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CountryDto,
    public countriesClient: CountriesClient,
    private _dialogRef: MatDialogRef<CountryCreateUpdateComponent>,
    private _handler: ApiHandlerService,
    private _fb: FormBuilder
  ) { }

  get nameAr(): AbstractControl {
    return this.form.get('name.Ar');
  }

  get nameEn(): AbstractControl {
    return this.form.get('name.En');
  }

  ngOnInit(): void {
    if (!this.data) {
      this.data = {} as CountryDto;

      this.form = this._fb.group({
        name: this._fb.group({
          Ar: ['', Validators.required],
          En: ['', Validators.required],
        }),
        isActive: [''],
      });
    } else {
      this.isActive.isActive =   this.data.isActive;
      
      this.form = this._fb.group({
        name: this._fb.group({
          Ar: [this.data.name.ar || '', Validators.required],
          En: [this.data.name.en || '', Validators.required],
        }),
        isActive: [''],
      });
    }

  }

  ngOnDestroy(): void {
    this._dialogRef.close(this.data);
  }

  post(value: any): any {
    const name = new LocalizedStringDto({ ar: value.name.Ar, en: value.name.En });
    const isActive = value.isActive;

    return new CountriesPostCommand({
      name,
      isActive
    });
  }

  put(id: any, value: any): any {
    const name = new LocalizedStringDto({ ar: value.name.Ar, en: value.name.En });
    const isActive = value.isActive;
    const order = value.order;

    return new CountriesPutCommand({
      id,
      name,
      isActive
    });
  }

  submit(event: any) {
    const value = event.value;

    const name = new LocalizedStringDto({ ar: value.name.Ar, en: value.name.En });

    event.action.subscribe((response: any) => {
      if (response) {
        this.data.id = response.result;
      }

      this.data.name = name;
      this.data.isActive = value.isActive;

      this._dialogRef.close();
      
      this._handler.handleSuccess();

    },
      (err) => {
        this._handler.handleError(err).pushError();
      }
    );
  }

  activate(event: boolean) {
    this.data.isActive = event;
  }

}