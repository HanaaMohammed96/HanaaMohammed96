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
        label: 'messageNumber',
        property: 'messageNumber',
        type: 'text',
        visible: true,
      },
      {
        label: 'emailNumber',
        property: 'emailNumber',
        type: 'text',
        visible: true,
      },
      {
        label: 'adminNumber',
        property: 'adminNumber',
        type: 'text',
        visible: true,
      },
      {
        label: 'inspectorNumber',
        property: 'inspectorNumber',
        type: 'text',
        visible: true,
      },
      {
        label: 'evaluatorNumber',
        property: 'evaluatorNumber',
        type: 'text',
        visible: true,
      },
      {
        label: 'auditorNumber',
        property: 'auditorNumber',
        type: 'text',
        visible: true,
      },
      {
        label: 'commissionerNumber',
        property: 'commissionerNumber',
        type: 'text',
        visible: true,
      },
      // {
      //   label: 'Actions',
      //   property: 'actions',
      //   type: 'button',
      //   visible: true,
      // }
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
