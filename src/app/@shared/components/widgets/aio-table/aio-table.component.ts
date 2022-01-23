import { FilterDialogComponent } from './filter-dialog/filter-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import icSearch from '@iconify/icons-ic/twotone-search';
import icFilterList from '@iconify/icons-ic/twotone-filter-list';
import icAdd from '@iconify/icons-ic/twotone-add';
import icEdit from '@iconify/icons-ic/twotone-edit';
import icDelete from '@iconify/icons-ic/twotone-delete';
import icUrl from '@iconify/icons-ic/round-open-in-new';
import { SelectionModel } from '@angular/cdk/collections';
import icMoreHoriz from '@iconify/icons-ic/twotone-more-horiz';
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldDefaultOptions,
} from '@angular/material/form-field';
import { FormControl } from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';
import { TableColumn } from '@core/interfaces/table-column.interface';
import { stagger40ms } from '@shared/animations/stagger.animation';
import { fadeInUp400ms } from '@shared/animations/fade-in-up.animation';
import { SelectionAction } from '@core/interfaces/selection-action';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiHandlerService } from '@core/services/api-handler.service';
import { FileManagerService } from '@core/services/file-manager.service';
import { PagingOptions } from '@core/interfaces/paging-options.interface';
import { FilterControl } from '@core/interfaces/filter-control.interface';

@UntilDestroy()
@Component({
  selector: 'app-aio-table',
  templateUrl: './aio-table.component.html',
  styleUrls: ['./aio-table.component.scss'],
  animations: [fadeInUp400ms, stagger40ms],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'standard',
      } as MatFormFieldDefaultOptions,
    },
  ],
})
export class AioTableComponent<T> implements OnInit, AfterViewInit, OnDestroy {
  // Required
  @Input() ref: any;
  @Input() title: string;
  @Input() description: string;
  @Input() tableName: string;
  @Input() tableNamePlural: string;
  @Input() client: any;
  @Input() columns: TableColumn<T>[];

  // Overriables
  @Input() itemIdName = 'id';
  @Input() getPageAction = 'getPage';
  @Input() dataObserable: string;
  @Input() filterControls: FilterControl[];
  @Input() layoutCtrl = new FormControl('boxed');
  @Input() selectionActions: SelectionAction[];
  @Input() createAction: SelectionAction;
  @Input() createUpdateComponent: any;
  @Input() onClickAction: SelectionAction;
  @Input() moreActions: SelectionAction[];
  @Input() actions: SelectionAction[];
  @Input() forForm: boolean;
  @Input() imageColumnName: string;
  @Input() pageIndex = 0;
  @Input() pageSize = 10;
  @Input() pageSizeOptions: number[] = [5, 10, 20, 50];
  @Input() minWidth = '400px';

  query: string;
  count = 0;

  dataSource: MatTableDataSource<any> | null;
  selection = new SelectionModel<any>(true, []);
  searchCtrl = new FormControl();

  deleteAllAction: SelectionAction;

  icSearch = icSearch;
  icFilterList = icFilterList;
  icAdd = icAdd;
  icEdit = icEdit;
  icDelete = icDelete;
  icMoreHoriz = icMoreHoriz;
  icUrl = icUrl;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private _translateService: TranslateService,
    private _handler: ApiHandlerService,
    private _dialog: MatDialog,
    private _cd: ChangeDetectorRef,
    private _route: ActivatedRoute,
    private _router: Router,
    private _fileManager: FileManagerService
  ) {}

  get visibleColumns() {
    return this.columns
      .filter((column) => column.visible)
      .map((column) => column.property);
  }

  async ngOnInit(): Promise<any> {
    await this.initializeOverridables();

    this.dataSource = new MatTableDataSource();

    this.dataSource.data = [];

    this._route.queryParams.subscribe((params) => {
      this.query = params.query;
      this.paginator.pageIndex = params.page ? params.page : this.paginator.pageIndex;
      this.paginator.pageSize = params.size ? params.size : this.paginator.pageSize;

      this.getPage();
    });
  }

  async ngAfterViewInit(): Promise<any> {
    // this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = await this.translate(
      'general.itemsPerPageLabel'
    );
    this.paginator._intl.firstPageLabel = await this.translate('general.firstPageLabel');
    this.paginator._intl.previousPageLabel = await this.translate(
      'general.previousPageLabel'
    );
    this.paginator._intl.nextPageLabel = await this.translate('general.nextPageLabel');
    this.paginator._intl.lastPageLabel = await this.translate('general.lastPageLabel');

    const ofLabel = await this.translate('general.of');
    this.paginator._intl.getRangeLabel = (
      page: number,
      pageSize: number,
      length: number
    ) => {
      if (length === 0 || pageSize === 0) {
        return `0 ${ofLabel} ${length}`;
      }
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      // If the start index exceeds the list length, do not try and fix the end index to the end.
      const endIndex =
        startIndex < length
          ? Math.min(startIndex + pageSize, length)
          : startIndex + pageSize;
      return `${startIndex + 1} - ${endIndex} ${ofLabel} ${length}`;
    };
  }

  ngOnDestroy(): void {
    this._dialog.closeAll();
  }

  getPage(): void {
    const pagingOptions = {
      pageSize: this.paginator.pageSize,
      pageIndex: this.paginator.pageIndex,
      query: this.query,
      ascending: true,
      sortBy: null,
    } as PagingOptions;

    if (this.dataObserable) {
      this.ref[this.dataObserable](pagingOptions).subscribe((list: any) => {
        this.dataSource.data = list.items;
        this.paginator.length = list.pageInfo.totalCount;

        this._cd.detectChanges();
      });

      return;
    }

    if (this.client && this.client.getPage) {
      this.client[this.getPageAction](
        pagingOptions.pageSize,
        pagingOptions.pageIndex,
        pagingOptions.query,
        pagingOptions.ascending,
        pagingOptions.sortBy
      ).subscribe((list: any) => {
        this.dataSource.data = list.items;
        this.paginator.length = list.pageInfo.totalCount;

        this._cd.detectChanges();
      });
    } else {
      this.dataSource.data = [];
    }
  }

  search(value: string): void {
    this._router.navigate([], {
      queryParams: {
        query: value,
      },
      queryParamsHandling: 'merge', // preserve the existing query params in the route
    });
  }

  changePage(event: any): void {
    this._router.navigate([], {
      queryParams: {
        page: event.pageIndex,
        size: event.pageSize,
      },
      queryParamsHandling: 'merge', // preserve the existing query params in the route
    });
  }

  async initializeOverridables(): Promise<any> {
    if (!this.selectionActions) {
      // this.deleteAllAction = {
      //   label: await this.translate('general.delete'),
      //   action: this.deleteAll,
      //   icon: icDelete,
      //   disabled: false,
      //   loading: false,
      // };
      // this.selectionActions = [this.deleteAllAction];
    }

    if (!this.createAction && this.createUpdateComponent) {
      this.createAction = {
        label: null,
        ref: null,
        actionName: 'create',
        icon: null,
        disabled: false,
        loading: false,
      };
    }

    if (!this.onClickAction && this.createUpdateComponent) {
      this.onClickAction = {
        label: null,
        ref: null,
        actionName: 'update',
        icon: null,
        disabled: false,
        loading: false,
      };
    }

    if (!this.actions) {
      this.actions = [
        {
          label: await this.translate('general.update'),
          ref: null,
          actionName: 'update',
          icon: icEdit,
          disabled: false,
          loading: false,
        },
        {
          label: await this.translate('general.delete'),
          ref: null,
          actionName: 'delete',
          icon: icDelete,
          disabled: false,
          loading: false,
        },
      ];
    }
  }

  detectChanges(): void {
    const newCount = this.dataSource.data.length;
    this.paginator.length = newCount;
    this.count = newCount;
    this._cd.detectChanges();
  }

  openFilterDialog(): void {
    this._dialog
      .open(FilterDialogComponent, { minWidth: this.minWidth, data: this.filterControls })
      .afterClosed()
      .subscribe((result) => {
        if (result && !result.closed) {
          this.getPage();
        }
      });
  }

  callSelectionAction(action: SelectionAction, param: any): void {
    action.ref[action.actionName](param);
  }

  callAction(action: SelectionAction, param: any): void {
    if (this.forForm && action.actionName == 'update') {
      this._router.navigate(['/form-update', param.id]);
    }
    if (!action || action.disabled || action.loading) {
      return;
    }

    if (action.ref) {
      if (!action.actionName) {
        return;
      }

      action.ref[action.actionName](action, param);
    } else {
      this[action.actionName](action, param);
    }

    this.detectChanges();
  }

  getColumnValue(row: T, columnName: string): any {
    const column = this.columns.find((c) => c.label === columnName);

    if (!column) {
      return null;
    }

    if (column.navigation) {
      return column.navigation(row);
    }

    const keys = column.property.split('.');

    if (!keys) {
      return null;
    }

    const value = this.callRecursively(row, keys);

    if (column.converter) {
      return column.converter(value);
    }

    return value;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  deselect(item: T): void {
    this.selection.deselect(item);
  }

  trackByProperty(index: number, column: TableColumn<T>): any {
    return column.property;
  }

  getCssClasses(column: TableColumn<T>, item: T): string[] {
    return [...(column.cssClasses || []), ...(column.ngCssClasses(item) || [])];
  }

  actionOnInit(action: SelectionAction, item: T): boolean {
    if (action && action.ref && action.onInitActionName) {
      action.ref[action.onInitActionName](action, item);
    }

    return true;
  }

  openUrl(event: MouseEvent, url: string): void {
    event.stopPropagation();
    window.open(url, '_blank');
  }

  viewUrl(event: MouseEvent, url: string): void {
    event.stopPropagation();

    if (url.includes('base64')) {
      window.open(this._fileManager.createObjectUrl(url));
    } else {
      window.open(url);
    }
  }

  remove(item: T, key: string): void {
    this.dataSource.data.splice(
      this.dataSource.data.findIndex((c: T) => c[key] === item[key]),
      1
    );

    this.dataSource.data = this.dataSource.data.slice();

    this.deselect(item);
    this._cd.detectChanges();
  }

  removeAll(items: T[], key: string): void {
    items.forEach((c) => this.remove(c, key));
  }

  create(): void {
    this._dialog
      .open(this.createUpdateComponent, { minWidth: this.minWidth })
      .afterClosed()
      .subscribe((item: any) => {
        if (!!item.id) {
          this.dataSource.data.unshift(item);
          this.dataSource.data = this.dataSource.data.slice();
          this._cd.detectChanges();
        }
      });
  }

  update(action: SelectionAction, item: T): void {
    this._dialog
      .open(this.createUpdateComponent, {
        minWidth: this.minWidth,
        data: item,
      })
      .afterClosed()
      .subscribe(() => this._cd.detectChanges());
  }

  delete(action: SelectionAction, item: T): void {
    action.loading = true;
    this.client
      .delete(item[this.itemIdName])
      .pipe(finalize(() => (action.loading = false)))
      .subscribe(
        () => {
          this.remove(item, this.itemIdName);
        },
        (err: any) => this._handler.handleError(err).pushError()
      );
  }

  private callRecursively(seed: any, keys: string[]): any {
    if (!keys || keys.length === 0) {
      return seed;
    }

    const key = keys.shift();

    return this.callRecursively(seed[key], keys);
  }

  private translate(key: string): Promise<string> {
    return this._translateService.get(key).toPromise();
  }
}
