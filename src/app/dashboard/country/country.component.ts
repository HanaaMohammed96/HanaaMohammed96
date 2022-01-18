import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import icAdd from '@iconify/icons-ic/twotone-add';
import icMoreHoriz from '@iconify/icons-ic/twotone-more-horiz';
import icEdit from '@iconify/icons-ic/twotone-edit';
import icDelete from '@iconify/icons-ic/twotone-delete';
import { MatDialog } from '@angular/material/dialog';
import { ApiHandlerService } from '@core/services/api-handler.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { PagingOptions } from '@core/interfaces/paging-options.interface';
import { ApiTestService } from '@core/apiTest.service';
import { LocalizedStringDto } from '@core/api';

export class Country {
  id:number;
  name?: LocalizedStringDto | undefined;
  isActive:boolean;
}


@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})


export class CountryComponent implements OnInit {
  list:Country[];

  loading = false;

  icAdd = icAdd;
  icMoreHoriz = icMoreHoriz;
  icEdit = icEdit;
  icDelete = icDelete;
  pagingOptions: PagingOptions
  constructor(
    private _dialog: MatDialog,
    private _handler: ApiHandlerService,
    private _cd: ChangeDetectorRef,
    private http:ApiTestService

  ) {
    // this.list =[{id:1,name:"Aswon",isActive:false}
    //            ,{id:2,name:"Cairo",isActive:true}
    //            ,{id:3,name:"Sohag",isActive:true}]
   }

  ngOnInit(): void {
    this.http.getAll().subscribe({
      next:(country)=>{
        this.list=country
      }
    })
  }
  drop(event: CdkDragDrop<string[]>): void {
    return;
  }

}
