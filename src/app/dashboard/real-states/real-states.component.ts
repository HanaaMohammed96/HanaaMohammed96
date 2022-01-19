import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import icAdd from '@iconify/icons-ic/twotone-add';
import icMoreHoriz from '@iconify/icons-ic/twotone-more-horiz';
import icEdit from '@iconify/icons-ic/twotone-edit';
import icDelete from '@iconify/icons-ic/twotone-delete';
import { MatDialog } from '@angular/material/dialog';
import { ApiHandlerService } from '@core/services/api-handler.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { finalize } from 'rxjs/operators';
import { IRealStatesClient, RealStateDto, RealStatesClient, RealStatesPutCommand, RealStatesPutOrderCommand } from '@core/api';
import { PagingOptions } from '@core/interfaces/paging-options.interface';
import { RealStateCreateUpdateComponent } from './real-state-create-update/real-state-create-update.component';

export enum Status {
  Active = 0,
  NotActive = 1,
}

@Component({
  selector: 'app-real-states',
  templateUrl: './real-state.component.html',
  styleUrls: ['./real-state.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RealStatesComponent implements OnInit {

  list: RealStateDto[];

  loading = false;

  icAdd = icAdd;
  icMoreHoriz = icMoreHoriz;
  icEdit = icEdit;
  icDelete = icDelete;
  pagingOptions: PagingOptions
  constructor(
    public _realStateClient: RealStatesClient,
    private _dialog: MatDialog,
    private _handler: ApiHandlerService,
    private _cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this._realStateClient.getPage().subscribe((list: any) => {
      this.list = list;

      this._cd.detectChanges();
    });
  }

  drop(event: CdkDragDrop<string[]>): void {
    // this._realStateClient
    //   .put(
    //     new RealStatesPutCommand({
    //       id: this.list[event.previousIndex].id,
    //       name: this.list[event.previousIndex].name,
    //       isActive: this.list[event.previousIndex].isActive,
    //     })
    //   )
    //   .subscribe(
    //     () => { },
    //     (err) => {
    //       this._handler.handleError(err).pushError();
    //       // return it to its position
    //       moveItemInArray(this.list, event.currentIndex, event.previousIndex);
    //     }
    //   );
    console.log('event in drop', typeof this.list[event.previousIndex])
    this._realStateClient
      .putOrder(new RealStatesPutOrderCommand({
        id: this.list[event.previousIndex].id,
        order: event.currentIndex
      }))
      .subscribe(
        (data) => { console.log('data', data) },
        (err) => {
          this._handler.handleError(err).pushError();
          // return it to its position
          moveItemInArray(this.list, event.currentIndex, event.previousIndex);
        }
      );
    moveItemInArray(this.list, event.previousIndex, event.currentIndex);
    return;
  }

  add(): void {
    this._dialog
      .open(RealStateCreateUpdateComponent, {
        minWidth: '400px',
        data: null,
      })
      .afterClosed()
      .subscribe((item: RealStateDto) => {
        if (item.id) {
          item.id = this.list.length + 1;

          this.list.push(item);

          this._cd.detectChanges();
        }
      });
  }

  update(item: RealStateDto): void {
    console.log('update item = ', item)
    this._dialog
      .open(RealStateCreateUpdateComponent, {
        minWidth: '400px',
        data: item,
      })
      .afterClosed()
      .subscribe(() => this._cd.detectChanges());
  }

  delete(item: RealStateDto): void {
    this.loading = true;

    this._realStateClient
      .delete(item.id)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(
        (a) => {
          this.remove(item);
        },
        (err: any) => this._handler.handleError(err).pushError()
      );
  }

  remove(item: RealStateDto): void {
    console.log('remove', item)
    this.list.splice(
      this.list.findIndex((c: RealStateDto) => c.id === item.id),
      1
    );

    this.list = this.list.slice();

    this._cd.detectChanges();
  }
}
