import { CdkDragDrop, copyArrayItem, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChangeFormDetailsService } from '@core/services/change-form-details.service';
import { DataField, value } from '@models/data-field';
import { TranslateService } from '@ngx-translate/core';
import { cloneDeep } from 'lodash';
import { EditFieldComponent } from '../edit-field/edit-field.component';


export enum DataFieldType {
  Text = "text",
  Date = "date",
  DateTime = "datetime-local",
  TextArea = "textarea",
  CheckBox = "checkbox",
  Radio = "radio",
  Select = "select",
  File = "file",
  Result = "result",
}
@Component({
  selector: 'app-form-editor',
  templateUrl: './form-editor.component.html',
  styleUrls: ['./form-editor.component.scss']
})
export class FormEditorComponent implements OnInit {
  lang: string
  value: value = {
    label: "",
    value: ""
  };

  fieldModels: Array<DataField> = [
    {
      "type": DataFieldType.Text,
      "label": this.translateService.instant('formFields.text'),
      "icon": "text_format",
      "placeholder": this.translateService.instant('formFields.enterText'),
      "required": false,
      "regex": "",
    },
    {
      "type": DataFieldType.Date,
      "icon": "today",
      "label": this.translateService.instant('formFields.date'),
    },
    {
      "type": DataFieldType.DateTime,
      "icon": "today",
      "label": this.translateService.instant('formFields.dateTime'),
    },
    {
      "type": DataFieldType.TextArea,
      "icon": "text_fields",
      "label": this.translateService.instant('formFields.textarea'),
      "placeholder": this.translateService.instant('formFields.enterText'),
    },
    {
      "type": DataFieldType.CheckBox,
      "icon": "fact_check",
      "required": false,
      "label": this.translateService.instant('formFields.checkBox'),
      "values": [
        {
          "label": this.translateService.instant('formFields.Option1'),
          "value": "option-1"
        },
        {
          "label": this.translateService.instant('formFields.Option2'),
          "value": "option-2"
        }
      ]
    },
    {
      "type": DataFieldType.Radio,
      "icon": "radio_button_checked",
      "label": this.translateService.instant('formFields.radio'),
      "required": false,
      "values": [
        {
          "label": this.translateService.instant('formFields.Option1'),
          "value": "option-1"
        },
        {
          "label": this.translateService.instant('formFields.Option2'),
          "value": "option-2"
        }
      ]
    },
    {
      "type": DataFieldType.Select,
      "icon": "menu",
      "label": this.translateService.instant('formFields.select'),
      "placeholder": "Select",
      "values": [
        {
          "label": this.translateService.instant('formFields.Option1'),
          "value": "option-1"
        },
        {
          "label": this.translateService.instant('formFields.Option2'),
          "value": "option-2"
        },
        {
          "label": this.translateService.instant('formFields.Option3'),
          "value": "option-3"
        }
      ]
    },
    {
      "type": DataFieldType.File,
      "icon": "upload_file",
      "label": this.translateService.instant('formFields.fileUpload'),
      "subtype": "file",
    }
    // ,
    // {
    //   "type": DataFieldType.Result,
    //   "label": this.translateService.instant('formFields.text'),
    //   "equation": ""
    // }
  ];

  modelFields: Array<DataField> = [];
  model: any = {
    name: this.translateService.instant('model.name'),
    description: this.translateService.instant('model.description'),
    arName: this.translateService.instant('model.name'),
    arDescription: this.translateService.instant('model.description'),
    attributes: this.modelFields
  };

  secondList: Array<DataField> = [];

  report = false;
  reports: any = [];

  constructor(
    public dialog: MatDialog,
    private translateService: TranslateService,
    private formDetailesModel: ChangeFormDetailsService
  ) {
    this.lang = localStorage.getItem('lang') as string
  }

  ngOnInit(): void { }

  drop(event: CdkDragDrop<string[]>) {
    console.log(event)
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.model.attributes = [...event.container.data]
      this.model.attributes[event.currentIndex].order = event.currentIndex+1
    } else {
      const clone = cloneDeep(event.previousContainer.data[event.previousIndex]);
      event.container.data.splice(event.currentIndex, 0, clone);
      this.model.attributes = [...event.container.data]
      this.model.attributes[event.currentIndex].order = event.currentIndex+1
      // if(this.model.attributes[event.currentIndex].code && this.model.attributes[event.currentIndex].type == 'number'){
      //   this.model.attributes[event.currentIndex].code += `${event.container.data.length}`
      // }
    }
    // if(!event.isPointerOverContainer){
    //   event.container.data.splice(event.previousIndex, 1)
    //   
    // }
  }

  addValue(values) {
    if (!values) {
      values = []
    }
    values.push(this.value);
    this.value = { label: "", value: "" };
  }


  removeField(i: number) {
    this.formDetailesModel.openConfirmDialog(this.translateService.instant('formFields.delete'))
      .afterClosed().subscribe(data => {
        if (data) {
          this.secondList.splice(i, 1);
          this.model.attributes.splice(i, 1);
        } else {
          return;
        }
      })
  }

  initReport() {
    this.report = true;
    this.reports = this.model.attributes;
    console.log('this.reports', this.reports)
  }

  onFileChanged(event) {
    const file = event.target.files[0]
  }

  openDialog(item: DataField, index: number) {
    let dialogRef = this.dialog.open(EditFieldComponent, {
      data: item,
      disableClose: true
    })
    dialogRef.afterClosed().subscribe((result => {
      this.model.attributes[index] = result;
      this.model.attributes[index].code = `A${this.model.attributes.length}`
    }))
  }

  formDetails() {
    this.formDetailesModel.openDialog().subscribe(data => {
      if (data) {
        this.model.name = data.name
        this.model.description = data.description
        this.model.arName = data.arName
        this.model.arDescription = data.arDescription
      } else {
        return;
      }
    });
  }

}
