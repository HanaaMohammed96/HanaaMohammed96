import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CountriesClient, CountryVm, LocalizedStringDto, RegionDto, RegionsClient, RegionsPostCommand, RegionsPutCommand } from '@core/api';
import { ApiHandlerService } from '@core/services/api-handler.service';

@Component({
  selector: 'app-region-create-update',
  templateUrl: './region-create-update.component.html'
})
export class RegionCreateUpdateComponent implements OnInit, OnDestroy {
  form: FormGroup;

  countries: CountryVm[]
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: RegionDto,
    public _RegionsClient: RegionsClient,
    private _dialogRef: MatDialogRef<RegionCreateUpdateComponent>,
    private _handler: ApiHandlerService,
    private _fb: FormBuilder,
    private countriesClient: CountriesClient,
  ) {
    console.log('regions@@@', this.data)
   }

  get nameAr(): AbstractControl {
    return this.form.get('name.Ar');
  }

  get nameEn(): AbstractControl {
    return this.form.get('name.En');
  }

  ngOnInit(): void {

    this.countriesClient.getList().subscribe(result => {
      this.countries = result;
    })
    if (!this.data) {
      this.data = {} as RegionDto;

      this.form = this._fb.group({
        name: this._fb.group({
          Ar: ['', Validators.required],
          En: ['', Validators.required],
        }),
        countryId: ['', Validators.required],
        isActive: [''],
      });
    } else {
      this.form = this._fb.group({
        name: this._fb.group({
          Ar: [this.data.name.ar || '', Validators.required],
          En: [this.data.name.en || '', Validators.required],
        }),
        countryId: ['', Validators.required],
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

    const countryId = value.countryId;

    const parentRegionId = null;

    return new RegionsPostCommand({
      name,
      isActive,
      parentRegionId,
      countryId
    });
  }

  put(id: any, value: any): any {

    const name = new LocalizedStringDto({ ar: value.name.Ar, en: value.name.En });

    const isActive = value.isActive;

    const countryId = value.countryId;

    const parentRegionId = null;

    return new RegionsPutCommand({
      id,
      name,
      isActive,
      parentRegionId,
      countryId
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
      this.data.countryId = value.countryId
      this._dialogRef.close();
    },
      (err) => {
        this._handler.handleError(err).pushError();
      }
    );
  }

  activate(event: boolean) {
    this.data.isActive = event;
  }
  onSelect(event: any) {
    this.data.countryId = event;
  }
}
