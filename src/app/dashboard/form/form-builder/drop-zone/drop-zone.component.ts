import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataFieldDto, FieldType, FormsClient, IDataFieldDto, IFormDto } from '@core/api';
import { ChangeFormDetailsService } from '@core/services/change-form-details.service';
import { FormEditorService } from '@core/services/form-editor.service';
import { TranslateService } from '@ngx-translate/core';
import { FormDetailesComponent } from '../../form-detailes/form-detailes.component';
import { cloneDeep } from 'lodash';
import { EditFieldComponent } from '../../edit-field/edit-field.component';

@Component({
  selector: 'app-drop-zone',
  templateUrl: './drop-zone.component.html',
  styleUrls: ['./drop-zone.component.scss']
})
export class DropZoneComponent implements OnInit, OnChanges {
  @Output() displayReport = new EventEmitter<boolean>();
  @Output() reportFields= new EventEmitter<IFormDto>();

  @Input() formId: number;
  @Input()model: IFormDto;
  @Input()displayForm: boolean;
  @Input()evt: CdkDragDrop<string[]>;

  type = FieldType;

  constructor(
    public formEditorService: FormEditorService,
    public dialog: MatDialog,
    private _FormsClient: FormsClient,
    private formDetailesModel: ChangeFormDetailsService,
    private translateService: TranslateService
    ) { 
      
    }
  ngOnChanges(changes: SimpleChanges): void {
    this.drop(this.evt);
  }

  ngOnInit(): void {
  }

  drop(event: CdkDragDrop<string[]>) {
    // for prevent duplicate items in dragable list
    // if (event.container.connectedTo[0].id == 'cdk-drop-list-0') {
    // if (this.lang =='en' && event.distance.x > 1 || this.lang =='ar' && event.distance.x < 1) {
    if (event.container.id == 'drag-Zone') {
      // this.removeField(event.currentIndex);
      return;
    }
    // for coping item in dropzone
    if (event.previousContainer === event.container) {
      // for sorting items
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

      this.model.fields[event.currentIndex].orders = event.currentIndex + 1;

    } else {
      const clone = cloneDeep(event.previousContainer.data[event.previousIndex]);
      event.container.data.splice(event.currentIndex, 0, clone);

      this.model.fields[event.currentIndex].orders = event.currentIndex + 1;

      this.model.fields[event.currentIndex].code += `${event.container.data.length}`;
    }
    this.formEditorService.validForm(this.model)

  }
  openDialog(item: IDataFieldDto, index: number) {

    localStorage.setItem('resetIem', JSON.stringify(this.model.fields[index]));

    const dialogRef = this.dialog.open(EditFieldComponent, {
      data: item,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result => {

      if (!result) {

        this.model.fields[index] = JSON.parse(localStorage.getItem('resetIem')) as DataFieldDto;

      } else {

        this.model.fields[index] = result;
      }

      localStorage.removeItem('resetIem');

    }));

  }
  removeField(i: number) {
    this.formDetailesModel.openConfirmDialog(this.translateService.instant('formFields.delete'))
      .afterClosed().subscribe(data => {
        if (data) {
          this.model.fields.splice(i, 1);
        } else {
          return;
        }
        this.formEditorService.validForm(this.model);
      });
  }
  onFileChanged(event) {
    const file = event.target.files[0];
  }
  initReport() {
    this.displayReport.emit(true);
    this.reportFields.emit({ ...this.model });
  }

  formDetails() {
    const dialoRef = this.dialog.open(FormDetailesComponent, {
      data: this.model
    });

    dialoRef.afterClosed().subscribe(result => {
      if (!result) {
        const { fields } = this.model
        if (this.formId) {
          // update form
          this._FormsClient.get(this.formId).subscribe(result => {
            this.model = result;
            this.model.fields = fields;
          });
        } else {
          // to reset incase cancel
          this.model = JSON.parse(localStorage.getItem('resetFormDetailes'));
          this.formEditorService.countryId = this.formEditorService.subRegionId = null;
          this.model.fields = this.formEditorService._model.fields;
        }
      } else {
        localStorage.setItem('resetFormDetailes', JSON.stringify(this.model));
      }
      this.formEditorService.validForm(this.model);
    });

  }

}
