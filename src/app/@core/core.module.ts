import { TranslateService } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldDefaultOptions,
} from '@angular/material/form-field';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import localeAr from '@angular/common/locales/ar';
import localeEn from '@angular/common/locales/en';

registerLocaleData(localeAr, 'ar');
registerLocaleData(localeEn, 'en');

@NgModule({
  imports: [CommonModule, HttpClientModule],
  exports: [HttpClientModule],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'fill',
      } as MatFormFieldDefaultOptions,
    },
    {
      provide: MAT_DATE_LOCALE,
      useFactory: (translate: TranslateService) => {
        return translate.currentLang;
      },
      deps: [TranslateService],
    },
    {
      provide: LOCALE_ID,
      useFactory: (translate: TranslateService) => {
        const userLang = translate.getBrowserLang();

        const lang = userLang === 'ar' || userLang === 'en' ? userLang : 'ar';

        return localStorage.getItem('lang') || lang;
      },
      deps: [TranslateService],
    },
  ],
})
export class CoreModule {}
