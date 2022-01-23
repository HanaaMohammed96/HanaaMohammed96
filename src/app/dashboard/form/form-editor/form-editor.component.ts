import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  DataFieldDto, DataValueDto, FieldType, FormsClient, IDataFieldDto,
  IFormDto, LocalizedStringDto
} from '@core/api';
import { ChangeFormDetailsService } from '@core/services/change-form-details.service';
import { TranslateService } from '@ngx-translate/core';
import { cloneDeep } from 'lodash';
import { EditFieldComponent } from '../edit-field/edit-field.component';
import icSave from '@iconify/icons-ic/baseline-save';
import { ApiHandlerService } from '@core/services/api-handler.service';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FormDetailesComponent } from '../form-detailes/form-detailes.component';
import { FormEditorService } from '@core/services/form-editor.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-form-editor',
  templateUrl: './form-editor.component.html',
  styleUrls: ['./form-editor.component.scss']
})
export class FormEditorComponent implements OnInit {
  lang: string;

  loading = false;

  icSave = icSave;

  type = FieldType;

  fieldModels: Array<IDataFieldDto> = [];

  model: IFormPostPutCommon = {};

  report = false;

  reports: IFormPostPutCommon = {};

  formId: number;

  constructor(
    // @Inject(MAT_DIALOG_DATA) public data: IFormDto,
    public dialog: MatDialog,
    private _FormsClient: FormsClient,
    private formDetailesModel: ChangeFormDetailsService,
    private _handler: ApiHandlerService,
    private translateService: TranslateService,
    private formEditorService: FormEditorService,
    private route: ActivatedRoute
  ) {

    this.lang = localStorage.getItem('lang') as string;

    this.model = this.formEditorService._model;

    this.fieldModels = this.formEditorService._fieldModels;

  }

  ngOnInit(): void {
    this.formId = this.route.snapshot.params.id;
    if (this.formId) {
      this._FormsClient.get(this.formId).subscribe(result => {
        this.model = result;
      });
    }
  }

  toLang(name: LocalizedStringDto) {
    if (this.lang == 'en') {
      return name.en;
    }
    return name.ar;
  }

  drop(event: CdkDragDrop<string[]>) {
    // for prevent duplicate items in dragable list
    if (event.container.connectedTo[0].id == 'cdk-drop-list-0') {

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

  }

  removeField(i: number) {
    this.formDetailesModel.openConfirmDialog(this.translateService.instant('formFields.delete'))
      .afterClosed().subscribe(data => {
        if (data) {
          this.model.fields.splice(i, 1);
        } else {
          return;
        }
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

        if (this.formId) {

          this._FormsClient.get(this.formId).subscribe(result => {
            this.model = result;
          });
        } else {

          this.model = this.formEditorService._model;

        }
      }
    });

  }

  save(): void {
    this.model.type = (Number)(this.model.type)
    let action: Observable<any>;
    const form = this.model;
    this.loading = true;

    if (!this.formId) {
      action = this._FormsClient.post(form.name.ar, form.name.en, form.description.ar, form.description.en, form.realStateId, form.type, form.fields);

    } else {
      action = this._FormsClient.put(form.id, form.name.ar, form.name.en, form.description.ar, form.description.en, form.realStateId, form.type, form.fields);
    }
    action.pipe(finalize(() => (this.loading = false))).subscribe(
      (response: any) => {
        if (response) {
          this.model = response;
        }
      },
      (err) => this._handler.handleError(err).pushError()
    );
  }

}