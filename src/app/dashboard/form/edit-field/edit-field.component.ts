import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormEditorComponent } from '../form-editor/form-editor.component';
import { DataField, value } from './../../../@models/data-field';

@Component({
  selector: 'app-edit-field',
  templateUrl: './edit-field.component.html',
  styleUrls: ['./edit-field.component.scss']
})
export class EditFieldComponent implements OnInit {
  value:value={
    label:"",
    value:""
  };
  resetItem:DataField;
  constructor(
    public dialogRef: MatDialogRef<FormEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataField
  ) { 
    this.resetItem = {...this.data}
  }

  ngOnInit(): void {
  }
  
  addValue(values){
    if(!values){
      values = []
    }
    values.push(this.value);
    this.value={label:"",value:""};
  }

  onNoClick(): void {
    

    this.data = this.resetItem
    this.dialogRef.close(this.data);
  }
  
}
