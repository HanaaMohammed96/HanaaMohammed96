import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
export interface DialogData {
  name:string;
  description:string;
}
@Component({
  selector: 'app-form-detailes',
  template:`
  <div class="p-4">
      <h3 color="primary" fxLayout="row" fxLayoutAlign="space-evenly center">
      {{"Form Detailes" | translate}}
    </h3>
    <div mat-dialog-content>
      <div fxLayout="column" fxLayoutAlign="start center">
      <div class="flex flex-row justify-evenly">
      <mat-form-field fxFlex="grow" appearance="outline" class="m-3">
      <mat-label>{{"Form Name" | translate}}</mat-label>
        <input matInput type="text" [(ngModel)]="data.name" />
      </mat-form-field>
      <mat-form-field fxFlex="grow" appearance="outline" class="m-3">
      <mat-label>{{"arName" | translate}}</mat-label>
        <input matInput type="text" [(ngModel)]="data.name" />
      </mat-form-field>
      </div>
      <div class="flex flex-row justify-evenly">
        <mat-form-field fxFlex="grow" appearance="outline" class="m-3">
        <mat-label>{{"Form Description" | translate}}</mat-label>
          <input matInput type="text" [(ngModel)]="data.description" />
        </mat-form-field>
        <mat-form-field fxFlex="grow" appearance="outline" class="m-3">
        <mat-label>{{"arDescription" | translate}}</mat-label>
          <input matInput type="text" [(ngModel)]="data.description" />
        </mat-form-field>
      </div>
      </div>
    </div>
    <div class="flex flex-row justify-evenly p-4" mat-dialog-actions>
      <button mat-button [mat-dialog-close]="data" cdkFocusInitial mat-raised-button color="primary">{{"Yes" |
        translate}}</button>
      <button mat-button (click)="onNoClick()" mat-raised-button color="primary">{{"No" |
          translate}}</button>
    </div >
  </div>
      
  `
})
export class FormDetailesComponent implements OnInit {
  name:string;
  description:string;

  constructor(
    public dialogRef: MatDialogRef<FormDetailesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {  }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
