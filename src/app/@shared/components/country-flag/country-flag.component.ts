import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { LocalizedStringDto } from '@core/api';
import { CountryFlagsService, ICountry } from '@core/services/countryFlags.service';

@Component({
  selector: 'app-country-flag',
  templateUrl: './country-flag.component.html',
})
export class CountryFlagComponent implements OnInit, OnChanges {

  @Input() phone: string;
  @Output() code: EventEmitter<string> = new EventEmitter();

  lang: string;
  countries: ICountry[] = [];

  dataCode: string;
  _code:string;

  constructor(
    private _countryService: CountryFlagsService,
  ) {
    this.lang = localStorage.getItem('lang') as string;
    this.countries = this._countryService.countries;
  }
  ngOnChanges(changes: SimpleChanges): void {
    const phone = changes.phone.currentValue;
    if (phone) {
      for (let country of this.countries) {
        if (phone.includes(country.code)) {
          this.dataCode = country.code;
          this.code.emit(this.dataCode)
        }
      }
    }

  }

  ngOnInit() {
  }

  toLang(name: LocalizedStringDto) {
    if (name) {
      if (this.lang == 'en') {
        return name.en;
      }
      return name.ar;
    } else {
      return " "
    }
  }

  setCode(event) {
    this._code = event.value.toString();
    this.code.emit(event.value.toString());
  }

}
