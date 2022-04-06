import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FieldType, IFormDto } from '@core/api';
import { FormEditorService } from '@core/services/form-editor.service';

@Component({
  selector: 'app-show-form',
  templateUrl: './show-form.component.html',
  styleUrls: ['./show-form.component.scss']
})
export class ShowFormComponent implements OnInit {
  @Input() reports: IFormDto;
  @Output() togglereport:EventEmitter<boolean> = new EventEmitter();
  type = FieldType;

  constructor(public formEditorService: FormEditorService) { }

  ngOnInit(): void {
  }

  closeReport(){
    this.togglereport.emit(false);
  }

}
