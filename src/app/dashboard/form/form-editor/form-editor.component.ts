import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  DataFieldDto, FieldType, FormsClient, IDataFieldDto, LocalizedStringDto
} from '@core/api';
import { ChangeFormDetailsService } from '@core/services/change-form-details.service';
import { TranslateService } from '@ngx-translate/core';
import { cloneDeep } from 'lodash';
import { EditFieldComponent } from '../edit-field/edit-field.component';
import icSave from '@iconify/icons-ic/baseline-save';
import { ApiHandlerService } from '@core/services/api-handler.service';
import { finalize, filter } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FormDetailesComponent } from '../form-detailes/form-detailes.component';
import { FormEditorService } from '@core/services/form-editor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IFormPostPut } from '@models/data-field';
import { IFormDto } from './../../../@core/api';

@Component({
  selector: 'app-form-editor',
  templateUrl: './form-editor.component.html',
  styleUrls: ['./form-editor.component.scss']
})
export class FormEditorComponent implements OnInit, OnDestroy {

  loading = false;

  icSave = icSave;

  type = FieldType;

  fieldModels: Array<IDataFieldDto> = [];

  model: IFormDto;

  report = false;

  reports: IFormDto;

  formId: number;

  validForm: boolean;

  searchText: string;

  lang: string;

  constructor(
    public dialog: MatDialog,
    private _FormsClient: FormsClient,
    private formDetailesModel: ChangeFormDetailsService,
    private _handler: ApiHandlerService,
    private translateService: TranslateService,
    public formEditorService: FormEditorService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    localStorage.setItem('resetFormDetailes', JSON.stringify(this.formEditorService._model))

    this.model = this.formEditorService._model;

    this.fieldModels = this.formEditorService._fieldModels;

    this.lang = localStorage.getItem('lang');

    this.formEditorService.validForm(this.model)

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
    this.formEditorService._validateForm.subscribe(data => {
      this.validForm = data;
    })
    this.formId = this.route.snapshot.params.id;
    if (this.formId) {
      this._FormsClient.get(this.formId).subscribe(result => {
        this.model = result;
        this.formEditorService.validForm(this.model);
      });
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    // for prevent duplicate items in dragable list
    // if (event.container.connectedTo[0].id == 'cdk-drop-list-0') {
    // if (this.lang =='en' && event.distance.x > 1 || this.lang =='ar' && event.distance.x < 1) {
    if (event.container.id == 'drag-Zone') {
      this.removeField(event.currentIndex);
      return;
    }
    // for coping item in dropzone
    if (event.previousContainer === event.container) {
      // for sorting items
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

      this.model.fields[event.currentIndex].orders = event.currentIndex + 1;

    } else {
      const clone = cloneDeep(event.previousContainer.data[event.previousIndex]);
      event.container.data.splice(event.currentIndex, 0, clone);

      this.model.fields[event.currentIndex].orders = event.currentIndex + 1;

      this.model.fields[event.currentIndex].code += `${event.container.data.length}`;
    }
    this.formEditorService.validForm(this.model)

  }

  removeField(i: number) {
    this.formDetailesModel.openConfirmDialog(this.translateService.instant('formFields.delete'))
      .afterClosed().subscribe(data => {
        if (data) {
          console.log('$$',this.model.fields)
          this.model.fields.splice(i, 1);
        } else {
          return;
        }
        this.formEditorService.validForm(this.model);
      });
  }

  initReport() {
    this.report = true;
    this.reports = { ...this.model };
  }

  onFileChanged(event) {
    const file = event.target.files[0];
  }

  openDialog(item: IDataFieldDto, index: number) {

    localStorage.setItem('resetIem', JSON.stringify(this.model.fields[index]));

    const dialogRef = this.dialog.open(EditFieldComponent, {
      data: item,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result => {

      if (!result) {

        this.model.fields[index] = JSON.parse(localStorage.getItem('resetIem')) as DataFieldDto;

      } else {

        this.model.fields[index] = result;
      }

      localStorage.removeItem('resetIem');

    }));

  }

  formDetails() {
    const dialoRef = this.dialog.open(FormDetailesComponent, {
      data: this.model
    });

    dialoRef.afterClosed().subscribe(result => {
      if (!result) {
        const { fields } = this.model
        if (this.formId) {
          // update form
          this._FormsClient.get(this.formId).subscribe(result => {
            this.model = result;
            this.model.fields = fields;
          });
        } else {
          // to reset incase cancel
          this.model = JSON.parse(localStorage.getItem('resetFormDetailes'));
          this.formEditorService.countryId = this.formEditorService.subRegionId = null;
          this.model.fields = this.formEditorService._model.fields;
        }
      } else {
        localStorage.setItem('resetFormDetailes', JSON.stringify(this.model));
      }
      this.formEditorService.validForm(this.model);
    });

  }

  save(): void {
    this.model.type = (Number)(this.model.type)

    let action: Observable<any>;

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
    action.pipe(finalize(() => (this.loading = false))).subscribe(
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

  search() {
    if (this.searchText == "") {
      this.fieldModels = this.formEditorService._fieldModels;
    } else {
      this.fieldModels = this.fieldModels.filter(res => {
        if (this.lang == 'ar') {
          return res.name.ar.toLocaleLowerCase().match(this.searchText.toLocaleLowerCase());
        } else {
          return res.name.en.toLocaleLowerCase().match(this.searchText.toLocaleLowerCase());
        }
      })
    }
  }

}