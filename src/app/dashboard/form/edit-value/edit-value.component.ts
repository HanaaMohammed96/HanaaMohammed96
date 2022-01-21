import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IDataValueDto, LocalizedStringDto } from '@core/api';

@Component({
  selector: 'app-edit-value',
  template: `
  <div fxLayout="row" fxLayoutAlign="space-evenly center" class="m-4" >
    <mat-icon color="accent" class='w-14'>add_task</mat-icon>
    <h3 class="whitespace-normal w-3/6"> {{toLang(data.value)}} </h3>
  </div>
  <div mat-dialog-content fxLayout="column" fxLayoutAlign="space-evenly center" >
    <mat-form-field>
    <mat-label>English value</mat-label>
    <input type="text" [(ngModel)]="data.value.en" matInput />
    </mat-form-field>

    <mat-form-field>
      <mat-label>Arabic value</mat-label>
      <input type="text" [(ngModel)]="data.value.ar" matInput />
    </mat-form-field>
  </div>
  <div mat-dialog-actions fxLayout="row" fxLayoutAlign="center center" class="m-4">
    <button mat-button [mat-dialog-close]="data" mat-raised-button color="primary">{{"Yes" | translate}}</button>
    <button mat-button [mat-dialog-close]="false" mat-raised-button color="primary">{{"No" | translate}}</button>
  </div>
  `,
  styles: [
  ]
})
export class EditValueComponent implements OnInit {
  lang: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IDataValueDto,
  ) {
    this.lang = localStorage.getItem('lang') as string;
  }

  ngOnInit(): void {
  }
  
  toLang(name: LocalizedStringDto) {
    if (this.lang == 'en') {
      return name.en;
    }

    return name.ar;
  }

}
