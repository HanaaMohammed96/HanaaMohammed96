import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PagingOptions } from '@core/interfaces/paging-options.interface';
import { SelectionAction } from '@core/interfaces/selection-action';
import { TableColumn } from '@core/interfaces/table-column.interface';
import { TranslateService } from '@ngx-translate/core';
import { AioTableComponent } from '@shared/components/widgets/aio-table/aio-table.component';
import { Observable } from 'rxjs';
import { PaginatedListOfPlanVmForDashborad, PlansClient, PlanVmForDashborad } from './../../@core/api';
import { PricePlansCreateUpdateComponent } from './price-plans-create-update/price-plans-create-update.component';

@Component({
  selector: 'app-price-plans',
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
  styles: [
  ]
})
export class PricePlansComponent implements OnInit {

  @ViewChild('table', { static: false }) table: AioTableComponent<PlanVmForDashborad>;

  form: FormGroup;

  component = PricePlansCreateUpdateComponent;

  columns: TableColumn<PlanVmForDashborad>[] = [];
  actions: SelectionAction[] = [];

  localized = { ban: null, cancel: null };
  constructor(
    public plansClient: PlansClient,
    private _fb: FormBuilder,
    private _dialog: MatDialog,
    private _translateService: TranslateService,
  ) {
    this.form = this._fb.group({
      serviceProviderId: [''],
    });
  }

  async ngOnInit(): Promise<any> {
    const roles = {
      Partner: { name: await this.translate('team.roles.partner'), color: 'bg-teal' }
    };


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
        label: 'plans.reportsNumber',
        property: 'reportsNumber',
        type: 'datetime',
        visible: true,
      },
      {
        label: 'plans.price',
        property: 'price',
        type: 'text',
        visible: true,
      },
      {
        label: 'plans.usersNumber',
        property: 'usersNumber',
        type: 'text',
        visible: true,
      },
      {
        label: 'Actions',
        property: 'actions',
        type: 'button',
        visible: true,
      },
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
  getData(pagingOptions: PagingOptions): Observable<PaginatedListOfPlanVmForDashborad > {


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
