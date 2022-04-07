import { Component, Input, OnInit } from '@angular/core';
import { DataFieldDto, FieldType } from '@core/api';
import { FormEditorService } from '@core/services/form-editor.service';
import { trackByValue } from '@core/utils/track-by';

@Component({
  selector: 'app-checkbox',
  template: `
    <div class="font-in-dropped flex flex-row flex-nowrap" >
      <div style="padding: 0px 6px 0px 0px;text-center;max-width: 90px;overflow-wrap: break-word">
        <mat-label>{{formEditorService.toLang(item.name)}}</mat-label>
      </div>
      <div class="flex flex-column flex-wrap">
        <div *ngFor="let i of item.dataValues; trackBy:trackByValue ">
          <mat-checkbox class="px-3">
            <span class="whitespace-normal">
            {{formEditorService.toLang(i.value)}}
            </span>
          </mat-checkbox>
        </div>
      </div>
    </div>
  `,
  styles: [
  ]
})
export class CheckboxComponent implements OnInit {
  @Input() item: DataFieldDto;

  type = FieldType;
  trackByValue= trackByValue;
  constructor(public formEditorService: FormEditorService) { }

  ngOnInit(): void {
  }

}
