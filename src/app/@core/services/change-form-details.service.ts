import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IFormDto } from '@core/api';
import { DataField } from '@models/data-field';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/dashboard/form/confirm-dialog/confirm-dialog.component';
import { EditFieldComponent } from 'src/app/dashboard/form/edit-field/edit-field.component';
import { FormDetailesComponent } from 'src/app/dashboard/form/form-detailes/form-detailes.component';

@Injectable({
  providedIn: 'root'
})
export class ChangeFormDetailsService {
  form:IFormDto
  item:DataField;

  constructor(
    public dialog: MatDialog
  ) { }

  openEditFielDialog(): Observable<any> {
    const dialogRef = this.dialog.open(EditFieldComponent, {
      data: this.item
    });
    return dialogRef.afterClosed();
  }

  openDialog(): Observable<any> {
    const dialogRef = this.dialog.open(FormDetailesComponent, {
      disableClose:true,
      data: {
        name:{
          ar:"",
          en: ""
        },
        description:{
          ar:"",
          en: ""
        }
      }
    });
    return dialogRef.afterClosed();
  }

  openConfirmDialog(msg){
    return this.dialog.open(ConfirmDialogComponent, {
      width:'390px',
      disableClose:true,
      data:{
        message : msg
      }
    });
  }
  
}
