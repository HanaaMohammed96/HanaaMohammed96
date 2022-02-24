import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PaginatedListOfPlanVmForDashborad, PlansClient, PlanVmForDashborad } from '@core/api';
import { PagingOptions } from '@core/interfaces/paging-options.interface';
import { SelectionAction } from '@core/interfaces/selection-action';
import { TableColumn } from '@core/interfaces/table-column.interface';
import { TranslateService } from '@ngx-translate/core';
import { AioTableComponent } from '@shared/components/widgets/aio-table/aio-table.component';
import { Observable } from 'rxjs';
import { PlansCreateUpdateComponent } from './plans-create-update/plans-create-update.component';

@Component({
  selector: 'app-plans',
  template: `
  <app-aio-table
  #table
  [ref]="this"
  [title]="'plans.title' | translate"
  [description]="'plans.description' | translate"
  [tableName]="'plans.tableName' | translate"
  [tableNamePlural]="'plans.tableNamePlural' | translate"
  [client]="plansClient"
  [createUpdateComponent]="component"
  [columns]="columns"
  [actions]="actions"
  [dataObserable]="'getData'"
></app-aio-table>
  `,
})
export class PlansComponent implements OnInit {
  @ViewChild('table', { static: false }) table: AioTableComponent<PlanVmForDashborad>;


  component = PlansCreateUpdateComponent;


  columns: TableColumn<PlanVmForDashborad>[] = [];
  actions: SelectionAction[] = [];

  localized = { ban: null, cancel: null };

  constructor(
    public plansClient: PlansClient,
    private _translateService: TranslateService,
  ) { }

  async ngOnInit(): Promise<any> {
    this.columns = [
      {
        label: 'plans.enName',
        property: 'name.en',
        type: 'text',
        visible: true,
      },
      {
        label: 'plans.arName',
        property: 'name.ar',
        type: 'text',
        visible: true,
      },
      {
        label: 'reportsNumber',
        property: 'reportsNumber',
        type: 'text',
        visible: true,
      },
      {
        label: 'price',
        property: 'price',
        type: 'text',
        visible: true,
      },
      {
        label: 'usersNumber',
        property: 'usersNumber',
        type: 'text',
        visible: true,
      },
      // {
      //   label: 'Actions',
      //   property: 'actions',
      //   type: 'button',
      //   visible: true,
      // },
    ];
  
    this.actions = [
      {
        label: await this.translate('general.update'),
        ref: this.table,
        actionName: 'update',
        icon: this.table.icEdit,
        disabled: false,
        loading: false,
      },
      {
        label: await this.translate('general.delete'),
        ref: this.table,
        actionName: 'delete',
        icon: this.table.icDelete,
        disabled: false,
        loading: false,
      },
    ];
  
  }
  getData(pagingOptions: PagingOptions): Observable<PaginatedListOfPlanVmForDashborad> {
    return this.plansClient.getPage(
      pagingOptions.pageSize,
      pagingOptions.pageIndex,
      pagingOptions.query,
      pagingOptions.ascending,
      pagingOptions.sortBy
    );
  }
  private translate(key: string): Promise<string> {
    return this._translateService.get(key).toPromise();
  }
}
