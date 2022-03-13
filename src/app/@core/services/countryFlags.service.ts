import { Injectable } from '@angular/core';
import { LocalizedStringDto } from '@core/api';

export interface ICountry {
  name: LocalizedStringDto;
  code: string;
  icon: string;
}

@Injectable({
  providedIn: 'root'
})
export class CountryFlagsService {
  private _countries: ICountry[] = [];

  constructor() {
    this._countries = [
      {
        name: new LocalizedStringDto({
          en: 'Egypt',
          ar: 'مصر'
        }),
        code:'+20 ',
        icon:'assets/img/flags/egypt.png'
      },
      {
        name: new LocalizedStringDto({
          en: 'Saudi Arabia',
          ar: 'السعودية'
        }),
        code:'+966 ',
        icon:'assets/img/flags/saudi-arabia.png'
      },
      {
        name: new LocalizedStringDto({
          en: 'Oman',
          ar: 'عمان'
        }),
        code:'+968 ',
        icon:'assets/img/flags/oman.png'
      },
      {
        name: new LocalizedStringDto({
          en: 'UAE',
          ar: 'الإمارات'
        }),
        code:'+971 ',
        icon:'assets/img/flags/united-arab-emirates.png'
      },
      {
        name: new LocalizedStringDto({
          en: 'Bahrain',
          ar: 'البحرين'
        }),
        code:'+973 ',
        icon:'assets/img/flags/bahrain.png'
      },
      {
        name: new LocalizedStringDto({
          en: 'Qatar',
          ar: 'قطر'
        }),
        code:'+974 ',
        icon:'assets/img/flags/qatar.png'
      },
      {
        name: new LocalizedStringDto({
          en: 'Kuwait',
          ar: 'الكويت'
        }),
        code:'+965 ',
        icon:'assets/img/flags/kuwait.png'
      },
      {
        name: new LocalizedStringDto({
          en: 'Jordan',
          ar: 'الأردن'
        }),
        code:'+962 ',
        icon:'assets/img/flags/jordan.png'
      },
    ]
  }

  get countries():ICountry[]{
    return this._countries;
  }

}
