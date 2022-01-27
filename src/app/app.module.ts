import { TokenInterceptor } from './@core/interceptors/token.interceptor';
import { ToastrModule } from 'ngx-toastr';
import { SharedModule } from '@shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from '@core/core.module';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from 'src/environments/environment';
import { API_BASE_URL } from '@core/api';
import { APP_VERSION } from '@core/interceptors/token.interceptor';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CoreModule,
    SharedModule,
    Ng2SearchPipeModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    ToastrModule.forRoot({
      timeOut: 10000,
      easeTime: 1000,
      positionClass: 'toast-bottom-left',
      preventDuplicates: true,
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: API_BASE_URL, useValue: environment.apiUrl },
    {
      provide: APP_VERSION,
      useFactory: () => document.getElementsByTagName('base')[0].getAttribute('version'),
      deps: [],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
