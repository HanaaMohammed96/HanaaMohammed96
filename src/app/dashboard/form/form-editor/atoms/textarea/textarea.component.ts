import { Component, Input, OnInit } from '@angular/core';
import { DataFieldDto, FieldType } from '@core/api';
import { FormEditorService } from '@core/services/form-editor.service';

@Component({
  selector: 'app-textarea',
  template: `
    <mat-form-field class="font-in-dropped" cdkDrag
      appearance="outline" fxFlex="grow">
      <mat-label>{{formEditorService.toLang(item.name)}}<label *ngIf="item.isRequired" color="warn">*</label>
      </mat-label>
      <textarea matInput placeholder="{{formEditorService.toLang(item.placeholder)}}"></textarea>
    </mat-form-field>
  `,
  styles: [
  ]
})
export class TextareaComponent implements OnInit {
  @Input() item: DataFieldDto;

  type = FieldType;
  constructor(public formEditorService: FormEditorService) { }

  ngOnInit(): void {
  }

}
