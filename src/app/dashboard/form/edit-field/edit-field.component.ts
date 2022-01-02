import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataField } from './../../../@models/data-field';

@Component({
  selector: 'app-edit-field',
  templateUrl: './edit-field.component.html',
  styleUrls: ['./edit-field.component.scss']
})
export class EditFieldComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<EditFieldComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataField
  ) { }

  ngOnInit(): void {
  }
  
  onNoClick(): void {
    this.dialogRef.close();
  }
}
