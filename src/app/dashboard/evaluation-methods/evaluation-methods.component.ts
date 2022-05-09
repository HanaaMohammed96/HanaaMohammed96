import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { RegionsClient, PaginatedListOfRegionDto } from '@core/api';
import { PagingOptions } from '@core/interfaces/paging-options.interface';
import { SelectionAction } from '@core/interfaces/selection-action';
import { TableColumn } from '@core/interfaces/table-column.interface';
import { TranslateService } from '@ngx-translate/core';
import { AioTableComponent } from '@shared/components/widgets/aio-table/aio-table.component';
import { Observable } from 'rxjs';
import { SubRegionsComponent } from '../sub-regions/sub-regions.component';
import { EvaluationMethodsCreateUpdateComponent } from './evaluation-methods-create-update/evaluation-methods-create-update.component';
import { EvaluationMethodsVmForDashboard } from './evaluation-methods.service';
import { SubEvaluationMethodsComponent } from './../sub-evaluation-methods/sub-evaluation-methods.component';

@Component({
  selector: 'app-evaluation-methods',
  template: `<app-aio-table
  #table
  [ref]="this"
  [title]="'evaluationMethods.title' | translate"
  [description]="'evaluationMethods.description' | translate"
  [tableName]="'evaluationMethods.tableName' | translate"
  [tableNamePlural]="'evaluationMethods.tableNamePlural' | translate"
  [client]="regionsClient"
  [createUpdateComponent]="component"
  [columns]="columns"
  [actions]="actions"
  [dataObserable]="'getData'"
></app-aio-table>`
})
export class EvaluationMethodsComponent implements OnInit {
  @ViewChild('table', { static: false }) table: AioTableComponent<EvaluationMethodsVmForDashboard>;

  form: FormGroup;

  component = EvaluationMethodsCreateUpdateComponent;

  columns: TableColumn<EvaluationMethodsVmForDashboard>[] = [];
  actions: SelectionAction[] = [];

  localized = { ban: null, cancel: null };
  constructor(
    public regionsClient: RegionsClient,
    private _dialog: MatDialog,
    private _translateService: TranslateService,
  ) { }

  async ngOnInit(): Promise<any> {
    const status = {
      Active: { name: await this.translate('evaluationMethods.isActive'), color: 'bg-green' },
      NotActive: { name: await this.translate('evaluationMethods.isNotActive'), color: 'bg-teal' },
    };

    this.columns = [
      {
        label: 'evaluationMethods.enName',
        property: 'name.en',
        type: 'text',
        visible: true,
      },
      {
        label: 'evaluationMethods.arName',
        property: 'name.ar',
        type: 'text',
        visible: true,
      },
      {
        label: 'evaluationMethods.status',
        property: 'isActive',
        converter: (value: any): string => {
          if(value){
            return status.Active.name;
          }else{
            return status.NotActive.name;
          }
        },
        type: 'badge',
        visible: true,
        ngCssClasses: (item: any): string[] => {
          if(item.isActive){
            return ['bg-green'];
          }else{
            return ['bg-teal'];
          }
        },
      },
      {
        label: 'Actions',
        property: 'actions',
        type: 'button',
        visible: true,
      }
    ];

    this.actions = [
      {
        label: await this.translate('evaluationMethods.viewevaluationMethods'),
        ref: this,
        actionName: 'viewevaluationMethods',
        icon: this.table.icMoreHoriz,
        disabled: false,
        loading: false,
      },
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
 
  getData(pagingOptions: PagingOptions): Observable<PaginatedListOfRegionDto> {

    return this.regionsClient.getPage(
      null,
      pagingOptions.pageSize,
      pagingOptions.pageIndex,
      pagingOptions.query,
      pagingOptions.ascending,
      pagingOptions.sortBy
    );
  }

  viewevaluationMethods(action: SelectionAction, item: EvaluationMethodsVmForDashboard): void {
    this._dialog.open(SubEvaluationMethodsComponent, {
      minWidth: this.table.minWidth,
      data: item,
    });
  }

  private translate(key: string): Promise<string> {
    return this._translateService.get(key).toPromise();
  }

}
