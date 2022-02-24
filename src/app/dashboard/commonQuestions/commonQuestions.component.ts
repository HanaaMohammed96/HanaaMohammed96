import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import icAdd from '@iconify/icons-ic/twotone-add';
import icMoreHoriz from '@iconify/icons-ic/twotone-more-horiz';
import icEdit from '@iconify/icons-ic/twotone-edit';
import icDelete from '@iconify/icons-ic/twotone-delete';
import { MatDialog } from '@angular/material/dialog';
import { PagingOptions } from '@core/interfaces/paging-options.interface';
import { CommonQuestion, CommonQuestionGetLocalizedListQuery, CommonQuestionPutOrderCommand } from '@core/api';
import { CommonQuestionsClient } from './../../@core/api';
import { ApiHandlerService } from '@core/services/api-handler.service';
import { CommonQuestionsCreateUpdateComponent } from './commonQuestionsCreateUpdate/commonQuestionsCreateUpdate.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-commonQuestions',
  templateUrl: './commonQuestions.component.html',
  styleUrls: ['./commonQuestions.component.scss']
})
export class CommonQuestionsComponent implements OnInit {
  list: CommonQuestion[];

  loading = false;

  icAdd = icAdd;
  icMoreHoriz = icMoreHoriz;
  icEdit = icEdit;
  icDelete = icDelete;
  pagingOptions: PagingOptions
  constructor(
    public _commonQuestionClient: CommonQuestionsClient,
    private _dialog: MatDialog,
    private _handler: ApiHandlerService,
    private _cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this._commonQuestionClient.getList(new CommonQuestionGetLocalizedListQuery()).subscribe((list: any)=>{
      this.list = list;
      this._cd.detectChanges();

    })
  }

  drop(event: CdkDragDrop<string[]>): void {
    this._commonQuestionClient
      .putOrder(
        new CommonQuestionPutOrderCommand({
          id: this.list[event.previousIndex].id,
          order: event.currentIndex + 1,
        })
      )
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
      .open(CommonQuestionsCreateUpdateComponent, {
        minWidth: '400px',
        data: null,
      })
      .afterClosed()
      .subscribe((item: CommonQuestion) => {
        if (item.id) {
          item.order = this.list.length + 1;

          this.list.push(item);

          this._cd.detectChanges();
        }
      });
  }

  update(item: CommonQuestion): void {
    this._dialog
      .open(CommonQuestionsCreateUpdateComponent, {
        minWidth: '400px',
        data: item,
      })
      .afterClosed()
      .subscribe(() => this._cd.detectChanges());
  }

  delete(item: CommonQuestion): void {
    this.loading = true;

    this._commonQuestionClient
      .delete(item.id)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(
        (a) => {
          this.remove(item);
        },
        (err: any) => this._handler.handleError(err).pushError()
      );
  }

  remove(item: CommonQuestion): void {
    this.list.splice(
      this.list.findIndex((c: CommonQuestion) => c.id === item.id),
      1
    );

    this.list = this.list.slice();

    this._cd.detectChanges();
  }

}
