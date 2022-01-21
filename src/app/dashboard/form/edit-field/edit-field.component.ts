import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataValueDto, FieldType, IDataFieldDto, LocalizedStringDto } from '@core/api';
import { EditValueComponent } from '../edit-value/edit-value.component';
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


  constructor(
    public dialogRef: MatDialogRef<FormEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDataFieldDto,
    public dialog: MatDialog,
  ) {
    this.lang = localStorage.getItem('lang') as string;

    this.value = new LocalizedStringDto({
      ar: 'الاختيار الاول',
      en: 'Option-1'
    });

  }

  ngOnInit(): void { }

  toLang(name: LocalizedStringDto) {
    if (this.lang == 'en') {
      return name.en;
    }

    return name.ar;
  }

  addValue(values: any[]) {
    if (!values) {
      return;
    }
    const newValue = { value: this.value }
    values.push(newValue);
    this.value = new LocalizedStringDto({
      ar: '',
      en: ''
    });
  }

  openDialog(item,index): void {

    localStorage.setItem('resetIem', JSON.stringify(item));

    const dialogRef = this.dialog.open(EditValueComponent, {
      data: item,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result => {
      if (!result) {

        this.data.dataValues[index] = JSON.parse(localStorage.getItem('resetIem')) as DataValueDto;

      } else {

        this.data.dataValues[index] = result;
      }

      localStorage.removeItem('resetIem');

    }));

  }

}
