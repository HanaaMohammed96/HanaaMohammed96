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


// export enum DataFieldType {
//   Text = 'text',
//   Date = 'date',
//   DateTime = 'datetime-local',
//   TextArea = 'textarea',
//   CheckBox = 'checkbox',
//   Radio = 'radio',
//   Select = 'select',
//   File = 'file',
//   Result = 'result',
// }
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

  // fieldModels: Array<DataField> = [
  //   {
  //     type: DataFieldType.Text,
  //     label: this.translateService.instant('formFields.text'),
  //     icon: 'text_format',
  //     placeholder: this.translateService.instant('formFields.enterText'),
  //     required: false,
  //     regex: '',
  //     code: 'A'
  //   },
  //   {
  //     type: DataFieldType.Date,
  //     icon: 'today',
  //     label: this.translateService.instant('formFields.date'),
  //     code: 'B'
  //   },
  //   {
  //     type: DataFieldType.DateTime,
  //     icon: 'today',
  //     label: this.translateService.instant('formFields.dateTime'),
  //     code: 'B'
  //   },
  //   {
  //     type: DataFieldType.TextArea,
  //     label: this.translateService.instant('formFields.textarea'),
  //     icon: 'text_fields',
  //     placeholder: this.translateService.instant('formFields.enterText'),
  //     required: false,
  //     code: 'C'
  //   },
  //   {
  //     type: DataFieldType.CheckBox,
  //     label: this.translateService.instant('formFields.checkBox'),
  //     values: [
  //       {
  //         label: this.translateService.instant('formFields.Option1'),
  //         value: 'option-1'
  //       },
  //       {
  //         label: this.translateService.instant('formFields.Option2'),
  //         value: 'option-2'
  //       }
  //     ],
  //     icon: 'fact_check',
  //     required: false,
  //     code: 'D'
  //   },
  //   {
  //     type: DataFieldType.Radio,
  //     label: this.translateService.instant('formFields.radio'),
  //     values: [
  //       {
  //         label: this.translateService.instant('formFields.Option1'),
  //         value: 'option-1'
  //       },
  //       {
  //         label: this.translateService.instant('formFields.Option2'),
  //         value: 'option-2'
  //       }
  //     ],
  //     icon: 'radio_button_checked',
  //     required: false,
  //     code: 'E'
  //   },
  //   {
  //     type: DataFieldType.Select,
  //     label: this.translateService.instant('formFields.select'),
  //     values: [
  //       {
  //         label: this.translateService.instant('formFields.Option1'),
  //         value: 'option-1'
  //       },
  //       {
  //         label: this.translateService.instant('formFields.Option2'),
  //         value: 'option-2'
  //       },
  //       {
  //         label: this.translateService.instant('formFields.Option3'),
  //         value: 'option-3'
  //       }
  //     ],
  //     icon: 'menu',
  //     required: false,
  //     code: 'F'
  //   },
  //   {
  //     type: DataFieldType.File,
  //     icon: 'upload_file',
  //     label: this.translateService.instant('formFields.fileUpload'),
  //     subtype: 'file',
  //     code: 'G'
  //   }
  //   // ,
  //   // {
  //   //   "type": DataFieldType.Result,
  //   //   "label": this.translateService.instant('formFields.text'),
  //   //   "equation": ""
  //   // }
  // ];
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
      fieldType: FieldType.Text
    },
    {
      name: new LocalizedStringDto({
        ar: 'تاريخ',
        en: 'Date'
      }),
      orders: null,
      isRequired: false,
      fieldType: FieldType.Date
    },
    {
      name: new LocalizedStringDto({
        ar: ' تاريخ ووقت',
        en: 'Date & Time'
      }),
      orders: null,
      isRequired: false,
      fieldType: FieldType.DateTime
    },
    {
      name: new LocalizedStringDto({
        ar: ' فقرة',
        en: 'Textarea'
      }),
      orders: null,
      isRequired: false,
      fieldType: FieldType.DateTime
    }
  ];
  // modelFields: Array<DataField> = [];
  // model: any = {
  //   name: this.translateService.instant('model.name'),
  //   description: this.translateService.instant('model.description'),
  //   arName: this.translateService.instant('model.name'),
  //   arDescription: this.translateService.instant('model.description'),
  //   attributes: this.modelFields
  // };
  // modelFields: Array<DataField> = [];

  model: IFormPostPutCommon = {};

  // secondList: Array<DataField> = [];
  secondList: Array<IDataFieldDto> = [];

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

  drop(event: CdkDragDrop<string[]>) {
    console.log(event.container.data);
    if (event.previousContainer === event.container) {

      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.model.fields = [...event.container.data] as unknown as DataFieldDto[];
      this.model.fields[event.currentIndex].orders = event.currentIndex + 1;
      // this.model.attributes = [...event.container.data];
      // this.model.attributes[event.currentIndex].orders = event.currentIndex + 1;

    } else {
      const clone = cloneDeep(event.previousContainer.data[event.previousIndex]);
      event.container.data.splice(event.currentIndex, 0, clone);
      this.model.fields = [...event.container.data] as unknown as DataFieldDto[];
      this.model.fields[event.currentIndex].orders = event.currentIndex + 1;
      // this.model.attributes = [...event.container.data];
      // this.model.attributes[event.currentIndex].orders = event.currentIndex + 1;

      // this.model.attributes[event.currentIndex].code += `${event.container.data.length}`;

    }
    // if(!event.isPointerOverContainer){
    //   event.container.data.splice(event.previousIndex, 1)
    //
    // }
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
          this.secondList.splice(i, 1);
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
