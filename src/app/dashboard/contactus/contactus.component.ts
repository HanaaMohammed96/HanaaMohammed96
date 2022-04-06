import { finalize } from 'rxjs/operators';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { fadeInUp400ms } from '@shared/animations/fade-in-up.animation';
import icSave from '@iconify/icons-ic/baseline-save';
import {
  ContentsClient,
  Language,
  ContentType,
  ContentVm,
  ContentsPutCommand,
} from '@core/api';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ApiHandlerService } from '@core/services/api-handler.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: [
    '../../../../node_modules/quill/dist/quill.snow.css',
    '../../@shared/styles/partials/plugins/_quill.scss',
  ],
  encapsulation: ViewEncapsulation.None,
  animations: [fadeInUp400ms],
})
export class ContactusComponent implements OnInit {

  form = new FormControl();

  loading = false;

  icSave = icSave;

  lang = Language.Ar;

  constructor(
    private _contentClient: ContentsClient,
    private _route: ActivatedRoute,
    private _handler: ApiHandlerService
  ) {}

  ngOnInit() {
    this._route.paramMap.pipe(untilDestroyed(this)).subscribe((param: ParamMap) => {
      this.lang = param.get('lang') === 'en' ? Language.En : Language.Ar;

      this._contentClient.get(this.lang, ContentType.ContactUs).pipe(untilDestroyed(this)).subscribe(
        (dto: ContentVm) => {
          this.form.setValue(dto.value);
        },
        (err) => this._handler.handleError(err).pushError()
      );
    });
  }

  save(): void {
    this.loading = true;

    this._contentClient
      .put(
        new ContentsPutCommand({
          type: ContentType.ContactUs,
          lang: this.lang,
          value: this.form.value,
        })
      )
      .pipe(finalize(() => (this.loading = false)), untilDestroyed(this))
      .subscribe(
        () => this._handler.handleSuccess(),
        (err) => this._handler.handleError(err).pushError()
      );
  }
}
