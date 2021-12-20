import { BehaviorSubject } from 'rxjs';
import { Injectable, Optional, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import emojioneUS from '@iconify/icons-emojione/flag-for-flag-united-states';
import emojioneEG from '@iconify/icons-emojione/flag-for-egypt';
import { Settings } from 'luxon';
import { Language } from '@core/api';
import { MAT_DATE_LOCALE } from '@angular/material/core';

@Injectable({
  providedIn: 'root',
})
export class LocalizationService {
  supportedLangs = [
    {
      name: 'en',
      lang: Language.En,
      title: 'English',
      isRtl: false,
      icon: emojioneUS,
    },
    {
      name: 'ar',
      lang: Language.Ar,
      title: 'العربية',
      isRtl: true,
      icon: emojioneEG,
    },
  ];

  defaultLang: any;
  selectedLang: any;

  constructor(
    private translateService: TranslateService
  ) {
    this.translateService.addLangs(this.supportedLangs.map((c) => c.name));

    this.defaultLang = this.getDefaultLang();

    const lang = this.supportedLangs.find((c) => c.name !== this.defaultLang.name).name;

    this.translateService.setDefaultLang(lang);
  }

  localize(): void {
    this.setLang(localStorage.getItem('lang'), false);
  }

  getLang(): Language {
    const lang = localStorage.getItem('lang');

    const output = lang
      ? this.supportedLangs.find((c) => c.name === lang)
      : this.getDefaultLang();

    return output.lang;
  }

  setLang(name: string, refresh = true): void {
    // Use the stored lang, or the default one if it doesn't exist
    const lang = this.supportedLangs.find((c) => c.name === name) || this.defaultLang;

    localStorage.setItem('lang', lang.name);

    if (refresh) {
      window.location.reload();
    } else {
      this.selectedLang = lang;
      Settings.defaultLocale = lang.name;
      document.documentElement.lang = lang.name;
      document.body.dir = lang.isRtl ? 'rtl' : 'ltr';

      this.translateService.use(lang.name);
    }
  }

  resetLang(): void {
    this.setLang(this.defaultLang);
  }

  // As default, use browser lang if it's supported, or use 'en'
  private getDefaultLang(): any {
    return (
      this.supportedLangs.find(
        (c) => c.name === this.translateService.getBrowserLang()
      ) || this.supportedLangs[0]
    );
  }
}
