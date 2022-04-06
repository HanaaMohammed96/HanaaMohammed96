import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  CountriesClient,
  CountryVm,
  RealStatesClient, RealStatesVm,
  RegionsClient,
  RegionVm, RequestType
} from '@core/api';
import { FormEditorService } from '@core/services/form-editor.service';
import { IFormDto } from './../../../@core/api';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';


@UntilDestroy()
@Component({
  selector: 'app-form-detailes',
  templateUrl: './form-detailes.component.html'
})
export class FormDetailesComponent implements OnInit {

  realStates: RealStatesVm[];

  countries: CountryVm[];

  regions: RegionVm[];

  subRegions: RegionVm[];

  formType = RequestType;

  types = [];

  type: number;

  arabicTypes = [];

  lang: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IFormDto,
    public dialogRef: MatDialogRef<FormDetailesComponent>,
    private realStateClient: RealStatesClient,
    private countriesClient: CountriesClient,
    private regionsClient: RegionsClient,
    public formEditorService: FormEditorService
  ) {
    this.types = Object.keys(this.formType).filter(f => !isNaN(Number(f)));
    this.lang = localStorage.getItem('lang')
    this.arabicTypes = ['معاينة','تقييم'];
  }

  ngOnInit(): void {

    this.realStateClient.getList().pipe(untilDestroyed(this)).subscribe(result => {
      console.log(result)
      this.realStates = result;
    });

    this.countriesClient.getList().pipe(untilDestroyed(this)).subscribe(result => {
      this.countries = result;
    });
    if (this.data.countryId){
      this.regionsClient.getList(this.data.countryId, null).pipe(untilDestroyed(this)).subscribe(result => {
        this.regions = result;
      });
    }

    if (this.data.countryId && this.data.parentRegionId) {
      this.regionsClient.getList(null, this.data.parentRegionId).pipe(untilDestroyed(this)).subscribe(result => {
        this.subRegions = result;
      });
    }

  }

  onSelectRealState(event: any) {
    this.data.realStateId = event;
  }

  onSelectType(event: any) {
    this.data.type = event;
  }

  onSelectCountry(event: any) {
    if (event) {
      this.regionsClient.getList(event, null).pipe(untilDestroyed(this)).subscribe(result => {
        if(result.length == 0){
          this.regions = this.subRegions = result;
          this.data.parentRegionId = this.data.regionId = null;
        }else{
          this.regions = result;
          this.data.parentRegionId = null;
        }
      });
    }

  }

  onSelectRegion(event: any) {
    this.data.regionId = event;
    if (event) {
      this.regionsClient.getList(null, event).pipe(untilDestroyed(this)).subscribe(result => {
        this.subRegions = result;
      });
    }
  }

}