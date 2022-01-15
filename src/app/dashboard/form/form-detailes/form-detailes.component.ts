import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IFormDto, RealStatesClient, RealStatesVm, RequestType } from '@core/api';

@Component({
  selector: 'app-form-detailes',
  template: `
  <div class="p-4">
      <h3 color="primary" fxLayout="row" fxLayoutAlign="space-evenly center">
      {{"Form Detailes" | translate}}
    </h3>
    <div mat-dialog-content>
      <div fxLayout="column" fxLayoutAlign="start center">
      <div class="flex flex-row justify-evenly">
      <mat-form-field fxFlex="grow" appearance="outline" class="m-3">
        <mat-label>{{'Form.enName' | translate}}</mat-label>
        <input matInput type="text" [(ngModel)]="data.name.en" />
      </mat-form-field>
      <mat-form-field fxFlex="grow" appearance="outline" class="m-3">
        <mat-label>{{'Form.arName' | translate}}</mat-label>
        <input matInput type="text" [(ngModel)]="data.name.ar" />
      </mat-form-field>
      </div>
      <div class="flex flex-row justify-evenly">
        <mat-form-field fxFlex="grow" appearance="outline" class="m-3">
          <mat-label>{{'Form.enDescription' | translate}}</mat-label>
          <textarea matInput [(ngModel)]="data.description.en" ></textarea>
        </mat-form-field>
        <mat-form-field fxFlex="grow" appearance="outline" class="m-3">
          <mat-label>{{'Form.arDescription' | translate}}</mat-label>
          <textarea matInput [(ngModel)]="data.description.ar"></textarea>
        </mat-form-field>
      </div>
      </div>
    </div>
    <div class="flex flex-row justify-evenly">
      <mat-form-field appearance="fill" class="flex flex-row justify-evenly p-4">
        <mat-label>{{'Form.RealState' | translate}}</mat-label>
        <mat-select (valueChange)="onSelect($event)">
          <mat-option *ngFor="let realState of realStates" [value]="realState.id">
            {{realState.name}}
          </mat-option>
        </mat-select>
      </mat-form-field> 
      <mat-form-field appearance="fill" class="flex flex-row justify-evenly p-4">
        <mat-label>{{'Form.type' | translate}}</mat-label>
        <mat-select (valueChange)="_onSelect($event)">
          <mat-option *ngFor="let type of types" [value]="type" >
            {{formType[type]}}
          </mat-option>
        </mat-select>
      </mat-form-field> 
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
  realStates: RealStatesVm[];
  formType = RequestType;
  types = [];
  constructor(
    public dialogRef: MatDialogRef<FormDetailesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IFormDto,
    private realStateClient: RealStatesClient
  ) {
    this.types = Object.keys(this.formType).filter(f => !isNaN(Number(f)));
  }

  ngOnInit(): void {
    this.realStateClient.getList().subscribe(result => {
      this.realStates = result
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  onSelect(event:any) {
    this.data.realStateId = event;
  }
  _onSelect(event:any) {
    console.log('event', event)
    this.data.type = event;
  }
}
