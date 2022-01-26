import { Component, Inject, OnInit, NgModule } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  CountriesClient,
  CountryVm, FormsClient,
  RealStatesClient, RealStatesVm,
  RegionsClient,
  RegionVm, RequestType
} from '@core/api';
import { FormEditorService } from '@core/services/form-editor.service';
import { IFormPostPut } from '@models/data-field';
import { IFormDto } from './../../../@core/api';

@Component({
  selector: 'app-form-detailes',
  templateUrl: './form-detailes.component.html'
})
export class FormDetailesComponent implements OnInit {

  realStates: RealStatesVm[];

  countries: CountryVm[];
  countryId: number;

  // regions = [{ name: 'region 1' , id: 1}];
  regions: RegionVm[];
  regionId: number;

  // subRegions = [{ name: 'subregion 1', id: 1 }];
  subRegions: RegionVm[];

  formType = RequestType;

  types = [];

  type: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IFormDto,
    public dialogRef: MatDialogRef<FormDetailesComponent>,
    private realStateClient: RealStatesClient,
    private _FormsClient: FormsClient,
    private countriesClient: CountriesClient,
    private regionsClient: RegionsClient,
    public formEditorService: FormEditorService
  ) {
    console.log('data in open form detailes component=>', this.data)
    this.types = Object.keys(this.formType).filter(f => !isNaN(Number(f)));
  }

  ngOnInit(): void {

    this.realStateClient.getList().subscribe(result => {
      this.realStates = result;
    });

    if (this.data.id) {
      // this._FormsClient.get(this.data.id).subscribe(result => {

      //   this.data.realStateId = result.realStateId;
      //   this.data.type = +result.type;
      //   this.data.countryId = +result.countryId;
      //   this.data.parentRegionId = +result.parentRegionId;
      //   this.data.regionId = +result.regionId;
      // });
    }

    this.countriesClient.getList().subscribe(result => {
      this.countries = result;
    });

  }

  onSelectRealState(event: any) {
    this.data.realStateId = event;
  }

  onSelectType(event: any) {
    this.data.type = event;
  }

  onSelectCountry(event: any) {
    this.countryId = event;
    if (this.countryId) {
      this.regionsClient.getList(this.countryId, null).subscribe(result => {
        this.regions = result;
      });
    }

    this.formEditorService.countryId = event;
  }

  onSelectRegion(event: any) {
    this.regionId = event;
    this.data.regionId = event;
    if (this.regionId) {
      this.regionsClient.getList(null, this.regionId).subscribe(result => {
        this.subRegions = result;
      });
    }
  }

  onSelectSub(event: any) {
    this.formEditorService.subRegionId = event;
  }

}