import { Component, Input, OnInit } from '@angular/core';
import { DataFieldDto, FieldType } from '@core/api';
import { FormEditorService } from '@core/services/form-editor.service';
import { trackByValue } from '@core/utils/track-by';

@Component({
  selector: 'app-drop-down',
  template: `
     <div *ngIf="item.fieldType == +type.Select " >
      <mat-form-field appearance="outline" class="font-in-dropped ">
        <mat-label>{{formEditorService.toLang(item.name)}}</mat-label>
        <input type="text" placeholder="Pick one" matInput [matAutocomplete]="auto">
        <mat-autocomplete #auto="matAutocomplete">
          <mat-option *ngFor="let i of item.dataValues; trackBy: trackByValue" value="{{i.value}}">
          {{formEditorService.toLang(i.value)}}
          </mat-option>
        </mat-autocomplete>
      </mat-form-field>
    </div>
    <!-- multi select !!!!!!11 -->
  `,
  styles: [
  ]
})
export class DropDownComponent implements OnInit {
  @Input() item: DataFieldDto;

  type = FieldType;
  trackByValue= trackByValue;
  constructor(public formEditorService: FormEditorService) { }

  ngOnInit(): void {
  }

}
