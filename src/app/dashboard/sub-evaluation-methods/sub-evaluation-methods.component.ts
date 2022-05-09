import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import icAdd from '@iconify/icons-ic/twotone-add';
import icMoreHoriz from '@iconify/icons-ic/twotone-more-horiz';
import icEdit from '@iconify/icons-ic/twotone-edit';
import icDelete from '@iconify/icons-ic/twotone-delete';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { RealStateDto, RealStatesClient, RealStatesPutOrderCommand } from '@core/api';
import { PagingOptions } from '@core/interfaces/paging-options.interface';
import { ApiHandlerService } from '@core/services/api-handler.service';
import { finalize } from 'rxjs/operators';
import { SubEvaluationMethodsCreateUpdateIsComponent } from './sub-evaluation-methods-create-update-is/sub-evaluation-methods-create-update-is.component';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-sub-evaluation-methods',
  templateUrl: './sub-evaluation-methods.component.html',
  styleUrls: ['./sub-evaluation-methods.component.scss']
})
export class SubEvaluationMethodsComponent implements OnInit {

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
    this._realStateClient.getPage()
    .pipe(untilDestroyed(this))
    .subscribe((list: any) => {
      this.list = list;

      this._cd.detectChanges();
    });
  }

  drop(event: CdkDragDrop<string[]>): void {
    this._realStateClient
      .putOrder(
        new RealStatesPutOrderCommand({
          id: this.list[event.previousIndex].id,
          order: event.currentIndex + 1,
        })
      )
      .pipe(untilDestroyed(this))
      .subscribe(
        () => { },
        (err) => {
          this._handler.handleError(err).pushError();
          // return it to its position
          moveItemInArray(this.list, event.currentIndex, event.previousIndex);
        }
      );
    moveItemInArray(this.list, event.previousIndex, event.currentIndex);
  }

  add(): void {
    this._dialog
      .open(SubEvaluationMethodsCreateUpdateIsComponent, {
        minWidth: '400px',
        data: null,
      })
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe((item: RealStateDto) => {
        if (item.id) {
          item.order = this.list.length + 1;

          this.list.push(item);

          this._cd.detectChanges();
        }
      });
  }

  update(item: RealStateDto): void {
    this._dialog
      .open(SubEvaluationMethodsCreateUpdateIsComponent, {
        minWidth: '400px',
        data: item,
      })
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(() => this._cd.detectChanges());
  }

  delete(item: RealStateDto): void {
    this.loading = true;

    this._realStateClient
      .delete(item.id)
      .pipe(finalize(() => (this.loading = false)), untilDestroyed(this))
      .subscribe(
        (a) => {
          this.remove(item);
        },
        (err: any) => this._handler.handleError(err).pushError()
      );
  }

  remove(item: RealStateDto): void {
    this.list.splice(
      this.list.findIndex((c: RealStateDto) => c.id === item.id),
      1
    );

    this.list = this.list.slice();

    this._cd.detectChanges();
  }

}
