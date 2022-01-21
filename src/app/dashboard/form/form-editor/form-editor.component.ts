import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  DataFieldDto, DataValueDto, FieldType, FormPostCommand,
  FormPutCommand, FormsClient, IDataFieldDto,
  IFormDto,
  IFormPostPutCommon, LocalizedStringDto
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

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IFormDto,
    public dialog: MatDialog,
    private _FormsClient: FormsClient,
    private formDetailesModel: ChangeFormDetailsService,
    private _handler: ApiHandlerService,
    private translateService: TranslateService
  ) {

    this.lang = localStorage.getItem('lang') as string;

    const dataValues = new DataValueDto({
      value: new LocalizedStringDto({
        ar: 'اختيار',
        en: 'Option'
      })
    })

    this.model = {
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

    this.fieldModels = [
      {
        name: new LocalizedStringDto({
          ar: 'نص',
          en: 'Text'
        }),
        orders: null,
        isRequired: false,
        fieldType: FieldType.Text,
        code: 'A',
        placeholder: '',
        regex: '',
      },
      {
        name: new LocalizedStringDto({
          ar: 'رقم',
          en: 'Number'
        }),
        orders: null,
        isRequired: false,
        fieldType: FieldType.Number,
        code: 'A'
      },
      {
        name: new LocalizedStringDto({
          ar: 'ناتج',
          en: 'Result'
        }),
        orders: null,
        isRequired: false,
        equation: null,
        fieldType: FieldType.Result,
        code: 'A'
      },
      {
        name: new LocalizedStringDto({
          ar: 'تاريخ',
          en: 'Date'
        }),
        orders: null,
        isRequired: false,
        fieldType: FieldType.Date,
        code: 'A'
      },
      {
        name: new LocalizedStringDto({
          ar: ' تاريخ ووقت',
          en: 'Date & Time'
        }),
        orders: null,
        isRequired: false,
        fieldType: FieldType.DateTime,
        code: 'A'
      },
      {
        name: new LocalizedStringDto({
          ar: ' فقرة',
          en: 'Textarea'
        }),
        orders: null,
        isRequired: false,
        fieldType: FieldType.TextArea,
        code: 'A',
        placeholder: '',
        regex: '',
      },
      {
        name: new LocalizedStringDto({
          ar: ' صورة',
          en: 'Image'
        }),
        orders: null,
        isRequired: false,
        fieldType: FieldType.Image,
        code: 'A',
      },
      {
        name: new LocalizedStringDto({
          ar: ' ملف',
          en: 'Pdf'
        }),
        orders: null,
        isRequired: false,
        fieldType: FieldType.Pdf,
        code: 'A',
      },
      {
        name: new LocalizedStringDto({
          ar: 'خانة اختيار ',
          en: 'CheckBox'
        }),
        orders: null,
        isRequired: false,
        fieldType: FieldType.CheckBox,
        code: 'A',
        dataValues: [dataValues, dataValues]
      },
      {
        name: new LocalizedStringDto({
          ar: 'زر اختيارات',
          en: 'Radio Button'
        }),
        orders: null,
        isRequired: false,
        fieldType: FieldType.Radio,
        code: 'A',
        dataValues: [dataValues, dataValues]
      },
      {
        name: new LocalizedStringDto({
          ar: 'قائمة منسدلة',
          en: 'Dropdown Menu'
        }),
        orders: null,
        isRequired: false,
        fieldType: FieldType.Select,
        code: 'A',
        dataValues: [dataValues, dataValues]
      }
    ];

  }

  ngOnInit(): void { 
    if (this.data.id) {
      this._FormsClient.get(this.data.id).subscribe(result => {
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
    // console.log('before send model', this.model)
    //   this.formDetailesModel.openDialog(this.model).subscribe(data => {
    //     this.model = data;
    //   });

    const dialoRef = this.dialog.open(FormDetailesComponent, {
      data: this.model
    })
    dialoRef.afterClosed().subscribe(result => {
      console.log('formDetails result', result);
      if (!result) {
        if (this.data.id) {
          this._FormsClient.get(this.data.id).subscribe(result => {
            this.model = result;
          });
        } else {
          this.model = {
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
      }
    })
  }

  save(): void {
    console.log('postput', this.model);
    let action: Observable<any>;

    this.loading = true;
    if (!this.data) {
      action = this._FormsClient
        .postPOST(
          new FormPostCommand({
          ...this.model
        })
        );

    } else {
      action = this._FormsClient.postPUT(
        new FormPutCommand({
          ...this.model
        })
      );
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
