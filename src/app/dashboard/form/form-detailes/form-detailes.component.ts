import { Component, Inject, OnInit, NgModule } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CountriesClient, CountryVm, FormsClient, RealStatesClient, RealStatesVm, RegionsClient, RegionsGetListQueryForDashboard, RegionVm, RequestType } from '@core/api';
import { FormEditorService } from '@core/services/form-editor.service';
import { IFormPostPut } from '@models/data-field';

@Component({
  selector: 'app-form-detailes',
  templateUrl: './form-detailes.component.html'
})
export class FormDetailesComponent implements OnInit {

  realStates: RealStatesVm[];

  countries: CountryVm[];
  countryId: number;

  regions = [{ name: 'region 1' , id: 1}];
  // regions: RegionVm[];
  regionId: number;

  subRegions = [{ name: 'subregion 1', id: 1 }];
  // subRegions: RegionVm[];

  formType = RequestType;

  types = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IFormPostPut,
    public dialogRef: MatDialogRef<FormDetailesComponent>,
    private realStateClient: RealStatesClient,
    private _FormsClient: FormsClient,
    private countriesClient: CountriesClient,
    private regionsClient: RegionsClient,
    public formEditorService: FormEditorService
  ) {

    this.types = Object.keys(this.formType).filter(f => !isNaN(Number(f)));
  }

  ngOnInit(): void {
    const query = new RegionsGetListQueryForDashboard({ countryId: this.countryId, parentRegionId: null });
    const _query = new RegionsGetListQueryForDashboard({ countryId: null, parentRegionId: this.regionId });

    this.realStateClient.getList().subscribe(result => {
      this.realStates = result;
    });

    this.countriesClient.getList().subscribe(result => {
      this.countries = result;
    })
    if (this.countryId) {
      this.regionsClient.getList(query).subscribe(result => {
        // this.regions = result;
      });
    }
    if (this.regionId) {
      this.regionsClient.getList(_query).subscribe(result => {
        // this.subRegions = result;
      });
    }
    console.log("=>", this.countryId, this.regionId);

    if (this.data.id) {
      this._FormsClient.get(this.data.id).subscribe(result => {
        this.data.realStateId = result.realStateId;
        this.data.type = +result.type;
      });
    }
  }

  onSelect(event: any) {
    this.data.realStateId = event;
  }
  
  _onSelect(event: any) {
    this.data.type = event;
  }

  onSelectCountry(event: any) {
    this.formEditorService.countryId = event;
  }
  onSelectSub(event: any) {
    this.formEditorService.subRegionId = event;
  }

}