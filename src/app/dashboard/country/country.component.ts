import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import icAdd from '@iconify/icons-ic/twotone-add';
import icMoreHoriz from '@iconify/icons-ic/twotone-more-horiz';
import icEdit from '@iconify/icons-ic/twotone-edit';
import icDelete from '@iconify/icons-ic/twotone-delete';
import { MatDialog } from '@angular/material/dialog';
import { ApiHandlerService } from '@core/services/api-handler.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { PagingOptions } from '@core/interfaces/paging-options.interface';
import { CountriesClient, CountriesPutOrderCommand, CountryDto, LocalizedStringDto } from '@core/api';
import { CountryCreateUpdateComponent } from './country-create-update/country-create-update.component';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})


export class CountryComponent implements OnInit {
  list: CountryDto[];

  loading = false;

  icAdd = icAdd;
  icMoreHoriz = icMoreHoriz;
  icEdit = icEdit;
  icDelete = icDelete;
  pagingOptions: PagingOptions
  constructor(
    private countriesClient: CountriesClient,
    private _dialog: MatDialog,
    private _handler: ApiHandlerService,
    private _cd: ChangeDetectorRef,

  ) { }

  ngOnInit(): void {
    this.countriesClient.getPage().subscribe((list: any) => {
      this.list = list;

      this._cd.detectChanges();
    })
  }

  drop(event: CdkDragDrop<string[]>): void {
    console.log('event in drop',  this.list[event.previousIndex])

    this.countriesClient
      .putOrder(new CountriesPutOrderCommand({
       
        id: this.list[event.previousIndex].id,
        order: event.currentIndex+1,

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
      .open(CountryCreateUpdateComponent, {
        minWidth: '400px',
        data: null,
      })
      .afterClosed()
      .subscribe((item: CountryDto) => {
        if (item.id) {
          item.id = this.list.length + 1;

          this.list.push(item);

          this._cd.detectChanges();
        }
      });
  }

  update(item: CountryDto): void {
    console.log('update item = ', item)
    this._dialog
      .open(CountryCreateUpdateComponent, {
        minWidth: '400px',
        data: item,
      })
      .afterClosed()
      .subscribe(() => this._cd.detectChanges());
  }

  delete(item: CountryDto): void {
    this.loading = true;

    this.countriesClient
      .delete(item.id)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(
        (a) => {
          this.remove(item);
        },
        (err: any) => this._handler.handleError(err).pushError()
      );
  }

  remove(item: CountryDto): void {
    console.log('remove', item)
    this.list.splice(
      this.list.findIndex((c: CountryDto) => c.id === item.id),
      1
    );

    this.list = this.list.slice();

    this._cd.detectChanges();
  }
}
