import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataValueDto, FieldType, IDataFieldDto, LocalizedStringDto } from '@core/api';
import { FormEditorComponent } from '../form-editor/form-editor.component';
import { DataField, value } from './../../../@models/data-field';

@Component({
  selector: 'app-edit-field',
  templateUrl: './edit-field.component.html',
  styleUrls: ['./edit-field.component.scss']
})
export class EditFieldComponent implements OnInit {
  lang: string;

  value: LocalizedStringDto;

  type = FieldType;

  resetItem: IDataFieldDto;

  constructor(
    public dialogRef: MatDialogRef<FormEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDataFieldDto
  ) {
    console.log(this.data);
    this.resetItem = {...this.data};
    console.log('resetItem=>', this.resetItem);
    this.lang = localStorage.getItem('lang') as string;

    this.value = new LocalizedStringDto({
      ar: 'الاختيار الاول',
      en: 'Option-1'
    });

  }

  ngOnInit(): void {
  }

  toLang(name: LocalizedStringDto) {
    if (this.lang == 'en') {
      return name.en;
    }

    return name.ar;
  }

  addValue(values: any[]){
    console.log('values',values)
    if (!values){
      return;
    }
    const newValue = {value:this.value}
    values.push(newValue);
    this.value = new LocalizedStringDto({
      ar: '',
      en: ''
    });
  }

  onNoClick(): void {

    this.data = {...this.resetItem};
    console.log('===>', this.resetItem);
    this.dialogRef.close(this.data);
  }

}
