import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { AdminVm, LocalizedStringDto } from '@core/api';
import { ApiHandlerService } from '@core/services/api-handler.service';
import { pluck } from 'rxjs/operators';
import { FormEditorService } from './../../../@core/services/form-editor.service';

interface CountriesPartnerVm {
  id:number,
  partnerId: string;
  name?: LocalizedStringDto;
}
interface RegionCountryVm {
  id:number,
  countryId: number;
  name?: LocalizedStringDto;
}
interface SubRegionCountryVm {
  id:number,
  regionId: number;
  name?: LocalizedStringDto;
}

@Component({
  selector: 'app-countries-regions-sub-regions',
  templateUrl: './countries-regions-sub-regions.component.html',
  styleUrls: ['./countries-regions-sub-regions.component.scss']
})
export class CountriesRegionsSubRegionsComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;

  countries:CountriesPartnerVm[];

  regions:RegionCountryVm[];
  regionsCtry:RegionCountryVm[];

  subRegions:SubRegionCountryVm[];
  subRegionsRegion:SubRegionCountryVm[];

  choosenCtry: boolean = false;
  choosenRegions: boolean = false;
  choosenSubs: boolean = false;
  // multi select
  selectedParent:CountriesPartnerVm | null = null;
  checklistSelection = new SelectionModel<RegionCountryVm>(true,[]);
  checklistSelectionRegions = new SelectionModel<RegionCountryVm>(true,[]);
  checklistSelectionSubRegions = new SelectionModel<SubRegionCountryVm>(true,[]);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: AdminVm,
    private _dialogRef: MatDialogRef<CountriesRegionsSubRegionsComponent>,
    private _handler: ApiHandlerService,
    public displayContentAccordingLang: FormEditorService,
  ) {
    this.countries = [
      {
        id:1,
        partnerId:this.data.id,
        name:new LocalizedStringDto({
          en: "Egypt",
          ar: "مصر"
        })
      },
      {
        id:2,
        partnerId:this.data.id,
        name:new LocalizedStringDto({
          en: "Saudi Arabian",
          ar: "السعودية"
        })
      },
      {
        id:3,
        partnerId:this.data.id,
        name:new LocalizedStringDto({
          en: "Oman",
          ar: "عمان"
        })
      },
    ];

    this.regions = [
      {
        id:1,
        countryId:1,
        name:new LocalizedStringDto({
          en: "Qina",
          ar: "قنا"
        })
      },
      {
        id:2,
        countryId:1,
        name:new LocalizedStringDto({
          en: "Cairo",
          ar: "القاهرة"
        })
      },
      {
        id:3,
        countryId:2,
        name:new LocalizedStringDto({
          en: "Mecca",
          ar: "مكة"
        })
      },
      {
        id:4,
        countryId:2,
        name:new LocalizedStringDto({
          en: "Taif",
          ar: "الطائف"
        })
      },
      {
        id:5,
        countryId:3,
        name:new LocalizedStringDto({
          en: "Balqa",
          ar: "البلقاء"
        })
      },
      {
        id:6,
        countryId:3,
        name:new LocalizedStringDto({
          en: "Zarqa",
          ar: "الزرقاء"
        })
      },
    ];

    this.subRegions = [
      {
        id:1,
        regionId:1,
        name:new LocalizedStringDto({
          en: "Qus",
          ar: "قوص"
        })
      },
      {
        id:1,
        regionId:1,
        name:new LocalizedStringDto({
          en: "Qus",
          ar: "قوص"
        })
      },
      {
        id:2,
        regionId:1,
        name:new LocalizedStringDto({
          en: "Hagaza",
          ar: "حجازة"
        })
      },
      {
        id:2,
        regionId:1,
        name:new LocalizedStringDto({
          en: "Hagaza",
          ar: "حجازة"
        })
      },
      {
        id:1,
        regionId:1,
        name:new LocalizedStringDto({
          en: "Qus",
          ar: "قوص"
        })
      },
      {
        id:1,
        regionId:1,
        name:new LocalizedStringDto({
          en: "Qus",
          ar: "قوص"
        })
      },
      {
        id:2,
        regionId:1,
        name:new LocalizedStringDto({
          en: "Hagaza",
          ar: "حجازة"
        })
      },
      {
        id:2,
        regionId:1,
        name:new LocalizedStringDto({
          en: "Hagaza",
          ar: "حجازة"
        })
      },
      {
        id:2,
        regionId:1,
        name:new LocalizedStringDto({
          en: "Hagaza",
          ar: "حجازة"
        })
      },
      {
        id:3,
        regionId:2,
        name:new LocalizedStringDto({
          en: "6 octobr",
          ar: "6 أكتوبر"
        })
      },
      {
        id:4,
        regionId:2,
        name:new LocalizedStringDto({
          en: "Maadi",
          ar: "معادي"
        })
      },
      {
        id:5,
        regionId:3,
        name:new LocalizedStringDto({
          en: "a1",
          ar: "أ"
        })
      },
      {
        id:6,
        regionId:4,
        name:new LocalizedStringDto({
          en: "b1",
          ar: "ب"
        })
      },
    ];

  }

  ngOnInit(): void {
    this.checklistSelection.changed
    .pipe(pluck('source', 'selected'))
    .subscribe((selected) => console.log(selected));
  }
  getRegions(ctry){
    this.regionsCtry = this.regions.filter(ele=>ele.countryId == ctry.id);
  }
  getSubRegions(region:RegionCountryVm, accordion:MatAccordion){
    // console.log(accordion);
    // if(accordion.id != "cdk-accordion-0"){
    //   accordion.closeAll();
    // }
    this.subRegionsRegion = this.subRegions.filter(ele=>ele.regionId == region.id);
  }
//select
  // setAll(e) {
  //   this.choosenRegions = this.choosenSubs = e.checked;
  // };
  isAllSelected() {
    
    // const numSelected = this.checklistSelectionRegions.selected.length;
    // const numRegions = this.regions.length;
    // const numSubs = this.subRegions.length;
    // return numSelected === numRegions + numSubs;
  }
  isSubsSelected() {
    const numSelected = this.checklistSelectionSubRegions.selected.length;
    console.log('subs',numSelected)
    // const numSubs = this.subRegions.length;
    // return numSelected === numSubs;
  }
  countryToggle(e) {
    this.choosenRegions = this.choosenSubs = e.checked;
    // this.isAllSelected() ?
    //     this.checklistSelectionRegions.clear() :
    //     this.regions.forEach(row => this.checklistSelectionRegions.select(row));
  }
  regionToggle(e) {
    // this.choosenSubs = e.checked;
    // this.isAllSelected() ?
    //     this.checklistSelectionSubRegions.clear() :
    //     this.subRegions.forEach(row => this.checklistSelectionSubRegions.select(row));
  }

  onNoClick(){
    this._dialogRef.afterClosed().subscribe(d=>console.log('##', this.checklistSelectionRegions))
    this._dialogRef.close()
  }
}
