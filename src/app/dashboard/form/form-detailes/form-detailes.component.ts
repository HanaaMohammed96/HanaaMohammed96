import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  CountriesClient,
  CountryVm, FormsClient,
  RealStatesClient, RealStatesVm,
  RegionsClient,
  RegionVm, RequestType
} from '@core/api';
import { FormEditorService } from '@core/services/form-editor.service';
import { IFormDto } from './../../../@core/api';

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

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IFormDto,
    public dialogRef: MatDialogRef<FormDetailesComponent>,
    private realStateClient: RealStatesClient,
    private countriesClient: CountriesClient,
    private regionsClient: RegionsClient,
    public formEditorService: FormEditorService
  ) {
    this.types = Object.keys(this.formType).filter(f => !isNaN(Number(f)));
  }

  ngOnInit(): void {

    this.realStateClient.getList().subscribe(result => {
      this.realStates = result;
    });

    this.countriesClient.getList().subscribe(result => {
      this.countries = result;
    });
    if (this.data.id) {
      this.data.type = this.data.type;

      this.regionsClient.getList(this.data.countryId, null).subscribe(result => {
        this.regions = result;
      });

      this.regionsClient.getList(null, this.data.parentRegionId).subscribe(result => {
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
      this.regionsClient.getList(event, null).subscribe(result => {
        this.regions = result;
      });
    }

  }

  onSelectRegion(event: any) {
    this.data.regionId = event;
    if (event) {
      this.regionsClient.getList(null, event).subscribe(result => {
        this.subRegions = result;
      });
    }
  }

  onSelectSub(event: any) {
  }

}