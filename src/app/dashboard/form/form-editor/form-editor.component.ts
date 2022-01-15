import { CdkDragDrop, copyArrayItem, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataFieldDto, FieldType, FormPostCommand, FormsClient, IDataFieldDto, IFormPostPutCommon, LocalizedStringDto } from '@core/api';
import { ChangeFormDetailsService } from '@core/services/change-form-details.service';
import { DataField, value } from '@models/data-field';
import { TranslateService } from '@ngx-translate/core';
import { cloneDeep } from 'lodash';
import { EditFieldComponent } from '../edit-field/edit-field.component';
import icSave from '@iconify/icons-ic/baseline-save';
import { ApiHandlerService } from '@core/services/api-handler.service';
import { finalize } from 'rxjs/operators';
import { addSeconds } from 'date-fns';

@Component({
  selector: 'app-form-editor',
  templateUrl: './form-editor.component.html',
  styleUrls: ['./form-editor.component.scss']
})
export class FormEditorComponent implements OnInit {
  lang: string;

  value: value = {
    label: '',
    value: ''
  };

  loading = false;

  icSave = icSave;

  type = FieldType;

  fieldModels: Array<IDataFieldDto> = [
    {
      name: new LocalizedStringDto({
        ar: 'نص',
        en: 'Text'
      }),
      orders: null,
      equation: '',
      isRequired: false,
      fieldType: FieldType.Text,
      code: "A"
    },
    {
      name: new LocalizedStringDto({
        ar: 'تاريخ',
        en: 'Date'
      }),
      orders: null,
      isRequired: false,
      fieldType: FieldType.Date,
      code: "A"
    },
    {
      name: new LocalizedStringDto({
        ar: ' تاريخ ووقت',
        en: 'Date & Time'
      }),
      orders: null,
      isRequired: false,
      fieldType: FieldType.DateTime,
      code: "A"
    },
    {
      name: new LocalizedStringDto({
        ar: ' فقرة',
        en: 'Textarea'
      }),
      orders: null,
      isRequired: false,
      fieldType: FieldType.TextArea,
      code: "A"
    }
  ];

  model: IFormPostPutCommon = {
    name: null,
    description: null,
    realStateId: null,
    type: null,
    fields: [],
  };

  report = false;
  reports: any = [];

  constructor(
    public dialog: MatDialog,
    private _FormsClient: FormsClient,
    private formDetailesModel: ChangeFormDetailsService,
    private _handler: ApiHandlerService,
    private translateService: TranslateService
  ) {
    this.lang = localStorage.getItem('lang') as string;

  }

  ngOnInit(): void { }

  toLang(name: LocalizedStringDto) {
    if (this.lang == 'en')
      return name.en;

    return name.ar
  }

  drop(event: CdkDragDrop<string[]>) {

    console.log(this.model.fields);

    if (event.container.connectedTo[0].id == "cdk-drop-list-0") {
      this.removeField(event.currentIndex);
      return;
    }

    if (event.previousContainer === event.container) {

      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

      this.model.fields[event.currentIndex].orders = event.currentIndex + 1;

    } else {
      const clone = cloneDeep(event.previousContainer.data[event.previousIndex]);
      event.container.data.splice(event.currentIndex, 0, clone);

      this.model.fields[event.currentIndex].orders = event.currentIndex + 1;

      this.model.fields[event.currentIndex].code += `${event.container.data.length}`;
    }

  }

  addValue(values) {
    if (!values) {
      values = [];
    }
    values.push(this.value);
    this.value = { label: '', value: '' };
  }


  removeField(i: number) {
    this.formDetailesModel.openConfirmDialog(this.translateService.instant('formFields.delete'))
      .afterClosed().subscribe(data => {
        if (data) {
          this.model.fields.splice(i, 1);
          // this.model.attributes.splice(i, 1);
          this.model.fields.splice(i, 1);
        } else {
          return;
        }
      });
  }

  initReport() {
    this.report = true;
    // this.reports = this.model.attributes;
    this.reports = this.model;
  }

  onFileChanged(event) {
    const file = event.target.files[0];
  }

  openDialog(item: DataField, index: number) {

    const dialogRef = this.dialog.open(EditFieldComponent, {
      data: item,
      disableClose: true
    });

    // dialogRef.afterClosed().subscribe((result => {
    //   this.model.attributes[index] = result;
    //   this.model.attributes[index].code = `A${this.model.attributes.length}`;
    // }));
  }

  formDetails() {
    this.formDetailesModel.openDialog().subscribe(data => {
      // form detailes
      console.log('formDetailesModel', data);
      this.model = data;
    });
  }
  save(): void {
    this.loading = true;
    console.log('this.model', this.model);
    this._FormsClient
      .postPOST(
        new FormPostCommand({
          ...this.model
        })
      )
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(
        () => this._handler.handleSuccess(),
        (err) => this._handler.handleError(err).pushError()
      );
  }

}
