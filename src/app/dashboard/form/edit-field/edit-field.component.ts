import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataValueDto, FieldType, IDataFieldDto, LocalizedStringDto } from '@core/api';
import { FormEditorService } from '@core/services/form-editor.service';
import { EditValueComponent } from '../edit-value/edit-value.component';
import { FormEditorComponent } from '../form-editor/form-editor.component';

@Component({
  selector: 'app-edit-field',
  templateUrl: './edit-field.component.html',
  styleUrls: ['./edit-field.component.scss']
})
export class EditFieldComponent implements OnInit {

  value: LocalizedStringDto;

  type = FieldType;


  constructor(
    public dialogRef: MatDialogRef<FormEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDataFieldDto,
    public dialog: MatDialog,
    public formEditorService: FormEditorService,
  ) {

    this.value = new LocalizedStringDto({
      ar: 'الاختيار الاول',
      en: 'Option-1'
    });

  }

  ngOnInit(): void { }

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

  openDialog(item, index): void {

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
