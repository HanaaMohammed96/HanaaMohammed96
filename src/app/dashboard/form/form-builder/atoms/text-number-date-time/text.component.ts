import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { DataFieldDto, FieldType } from '@core/api';
import { FormEditorService } from '@core/services/form-editor.service';

@Component({
  selector: 'app-text',
  template: `
      <ng-container *ngIf=" item.fieldType == +type.Text || item.fieldType == +type.Result">
      <mat-form-field class="font-in-dropped" appearance="outline" fxFlex="grow">
            <mat-label>{{formEditorService.toLang(item.name)}}<label *ngIf="item.isRequired" color="warn">*</label>
            </mat-label>
            <input type="text" placeholder="{{formEditorService.toLang(item.placeholder)}}" matInput />
          </mat-form-field>
      </ng-container>

      <ng-container *ngIf=" item.fieldType == +type.Number" >
          <mat-form-field  class="font-in-dropped" appearance="outline"
            fxFlex="grow">
            <mat-label>{{formEditorService.toLang(item.name)}}<label *ngIf="item.isRequired" color="warn">*</label>
            </mat-label>
            <input type="number" matInput />
          </mat-form-field>
      </ng-container>

      <ng-container *ngIf=" item.fieldType == +type.Hidden" >
          <mat-form-field class="font-in-dropped hidden" appearance="outline"
            fxFlex="grow" >
            <mat-label>{{formEditorService.toLang(item.name)}}<label *ngIf="item.isRequired" color="warn">*</label>
            </mat-label>
            <input type="text" matInput />
          </mat-form-field>
      </ng-container>

      <ng-container *ngIf=" item.fieldType == +type.Date" >
          <mat-form-field  class="font-in-dropped" appearance="outline"
            fxFlex="grow">
            <mat-label>{{formEditorService.toLang(item.name)}}<label *ngIf="item.isRequired" color="warn">*</label>
            </mat-label>
            <input type="date" matInput />
          </mat-form-field>
      </ng-container>

      <ng-container *ngIf=" item.fieldType == +type.DateTime" >
          <mat-form-field class="font-in-dropped"
            appearance="outline" fxFlex="grow">
            <mat-label>{{formEditorService.toLang(item.name)}}<label *ngIf="item.isRequired" color="warn">*</label>
            </mat-label>
            <input type="datetime-local" matInput />
          </mat-form-field> 
      </ng-container>
  `,
  styles: [
  ]
})
export class TextComponent implements OnInit{

  @Input() item: DataFieldDto;

  type = FieldType;

  constructor(public formEditorService: FormEditorService) { }
  

  ngOnInit(): void {
    
  }

}
