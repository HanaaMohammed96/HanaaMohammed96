import { Component, Input, OnInit } from '@angular/core';
import { DataFieldDto, FieldType } from '@core/api';
import { FormEditorService } from '@core/services/form-editor.service';
import { trackByValue } from '@core/utils/track-by';

@Component({
  selector: 'app-radio-button',
  template: `
    <div class="font-in-dropped flex flex-row flex-nowrap" cdkDrag>
      <div style="padding: 0px 6px 0px 0px;text-center;max-width: 90px;overflow-wrap: break-word">
        <mat-label>{{formEditorService.toLang(item.name)}}</mat-label>
      </div>
      <div class="flex flex-column flex-wrap">
        <mat-radio-group aria-label="Select an option" *ngFor="let i of item.dataValues; trackBy:trackByValue">
          <mat-radio-button value="formEditorService.toLang(i.value)" name="formEditorService.toLang(item.name)" class="px-3">
            <span class="whitespace-normal">
            {{formEditorService.toLang(i.value)}}
            </span>
          </mat-radio-button>
        </mat-radio-group>
      </div>
    </div>
  `,
  styles: [
  ]
})
export class RadioButtonComponent implements OnInit {
  @Input() item: DataFieldDto;

  type = FieldType;
  trackByValue= trackByValue;
  constructor(public formEditorService: FormEditorService) { }

  ngOnInit(): void {
  }

}
