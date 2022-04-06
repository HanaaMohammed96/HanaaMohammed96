import { Component, OnInit } from '@angular/core';
import { FieldType, IDataFieldDto } from '@core/api';
import { FormEditorService } from '@core/services/form-editor.service';

@Component({
  selector: 'app-dragable-zone',
  templateUrl: './dragable-zone.component.html',
  styleUrls: ['./dragable-zone.component.scss']
})
export class DragableZoneComponent implements OnInit {
  fieldModels: Array<IDataFieldDto> = [];
  searchText: string;
  lang: string;
  type = FieldType;

  constructor(public formEditorService: FormEditorService) {
    this.fieldModels = this.formEditorService._fieldModels;
    this.lang = localStorage.getItem('lang');
  }
  ngOnInit(): void {
  }
  search() {
    if (this.searchText == "") {
      this.fieldModels = this.formEditorService._fieldModels;
    } else {
      this.fieldModels = this.fieldModels.filter(res => {
        if (this.lang == 'ar') {
          return res.name.ar.toLocaleLowerCase().match(this.searchText.toLocaleLowerCase());
        } else {
          return res.name.en.toLocaleLowerCase().match(this.searchText.toLocaleLowerCase());
        }
      })
    }
  }
}
