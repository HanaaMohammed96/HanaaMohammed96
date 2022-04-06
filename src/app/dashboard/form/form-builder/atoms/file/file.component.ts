import { Component, Input, OnInit } from '@angular/core';
import { DataFieldDto, FieldType } from '@core/api';

@Component({
  selector: 'app-file',
  template: `
    <ng-container [ngSwitch]="item.fieldType">
      <div *ngSwitchCase="+type.SingleImage">
        <button class="upload-box mb-4 p-3 w-full"
          onclick="document.getElementById('image').click()">Image</button>
        <input type="file" id="image" class="upload-box mb-4 "
          style="display:none" />
      </div>
      <div *ngSwitchCase="+type.MultiImages">
        <button class="upload-box mb-4 p-3 w-full"
          onclick="document.getElementById('images').click()">Images</button>
        <input type="file" id="images" multiple class="upload-box mb-4 "
          style="display:none" />
      </div>
      <div *ngSwitchCase="+type.Pdf">
        <button class="upload-box mb-4 p-3 w-full"
              onclick="document.getElementById('pdf').click()">PDF</button>
        <input type="file"  id="pdf" multiple class="upload-box mb-4"
          style="display:none" />
      </div>
      <ng-container *ngSwitchDefault>An Error Occured</ng-container>
    </ng-container>
  `,
  styles: [
  ]
})
export class FileComponent implements OnInit {
  @Input() item: DataFieldDto;

  type = FieldType;
  constructor() { }

  ngOnInit(): void {
  }

}
