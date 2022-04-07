import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { IDataFieldDto, FieldType, IFormDto, FormsClient, LocalizedStringDto } from '@core/api';
import { ApiHandlerService } from '@core/services/api-handler.service';
import { FormEditorService } from '@core/services/form-editor.service';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { DragableZoneComponent } from './dragable-zone/dragable-zone.component';
import icSave from '@iconify/icons-ic/baseline-save';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-form-builder',
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.scss']
})
export class FormBuilderComponent implements OnInit {

  @ViewChild(DragableZoneComponent) dragArea: DragableZoneComponent;
  fieldModels: Array<IDataFieldDto> = [];
  sendEvent: CdkDragDrop<string[]>;
  type = FieldType;
  model: IFormDto;
  reports: IFormDto;
  formId: number;

  icSave = icSave;

  validForm: boolean;
  loading = false;
  report = false;

  lang: string;

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private _FormsClient: FormsClient,
    private _handler: ApiHandlerService,
    public formEditorService: FormEditorService,
  ) {
    localStorage.setItem('resetFormDetailes', JSON.stringify(this.formEditorService._model))

    this.model = this.formEditorService._model;

    this.lang = localStorage.getItem('lang');

    // this.formEditorService.validForm(this.model)

  }

  ngAfterViewInit(): void {
    this.fieldModels = this.dragArea.fieldModels;
  }

  ngOnDestroy(): void {
    localStorage.removeItem('resetFormDetailes');
    localStorage.removeItem('resetIem');

    this.formEditorService._model = {
      name: new LocalizedStringDto({
        ar: '',
        en: ''
      }),
      description: new LocalizedStringDto({
        ar: '',
        en: ''
      }),
      realStateId: null,
      type: null,
      fields: [],
    };

  }

  ngOnInit(): void {
    this.formEditorService._validateForm.pipe(untilDestroyed(this)).subscribe(data => {
      this.validForm = data;
    });

    this.formId = this.route.snapshot.params.id;
    if (this.formId) {
      this._FormsClient.get(this.formId).pipe(untilDestroyed(this)).subscribe(result => {
        this.model = result;
        this.formEditorService.validForm(this.model);
        console.log(this.model)
      });
    }
  }

  isValid() {
    return this.model.name.ar != '' &&
      this.model.name.en != '' &&
      this.model.description.ar != '' &&
      this.model.description.en != '' &&
      this.model.realStateId != null &&
      this.model.type != null && (this.model.parentRegionId != null || this.model.regionId != null) && this.model.fields.length != 0;
  }

  drop(evt) {
    this.sendEvent = evt;
  }


  save(): void {
    this.model.type = (Number)(this.model.type)

    let action: Observable<any>;

    if (this.model.regionId == null)
      this.model.regionId = this.model.parentRegionId

    const form = this.model;

    this.loading = true;
    if (!this.formId) {
      action = this._FormsClient.post(
        form.name.ar,
        form.name.en,
        form.description.ar,
        form.description.en,
        form.realStateId,
        form.type, form.regionId, form.fields);

    } else {

      action = this._FormsClient.put(
        form.id,
        form.name.ar,
        form.name.en,
        form.description.ar,
        form.description.en,
        form.realStateId,
        form.type, form.regionId, form.fields);
    }
    action.pipe(finalize(() => (this.loading = false))).pipe(untilDestroyed(this)).subscribe(
      (response: any) => {
        if (response) {
          this.model = response;
        }
        this._handler.handleSuccess();
        this.router.navigate(['/forms']);
      },
      (err) => {
        this._handler.handleError(err).pushError();
      }
    );
  }

}
