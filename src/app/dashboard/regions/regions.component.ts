import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PaginatedListOfRegionVmForDashboard, RegionsClient, RegionVmForDashboard } from '@core/api';
import { PagingOptions } from '@core/interfaces/paging-options.interface';
import { SelectionAction } from '@core/interfaces/selection-action';
import { TableColumn } from '@core/interfaces/table-column.interface';
import { TranslateService } from '@ngx-translate/core';
import { AioTableComponent } from '@shared/components/widgets/aio-table/aio-table.component';
import { Observable } from 'rxjs';
import { RegionCreateUpdateComponent } from './region-create-update/region-create-update.component';

@Component({
  selector: 'app-regions',
  template: `<app-aio-table
    #table
    [ref]="this"
    [title]="'regions.title' | translate"
    [description]="'regions.description' | translate"
    [tableName]="'regions.tableName' | translate"
    [tableNamePlural]="'regions.tableNamePlural' | translate"
    [client]="regionsClient"
    [createUpdateComponent]="component"    
    [columns]="columns"
    [actions]="actions"
    [dataObserable]="'getData'"
  ></app-aio-table>`,
})
export class RegionsComponent implements OnInit {
  @ViewChild('table', { static: false }) table: AioTableComponent<RegionVmForDashboard>;

  form: FormGroup;

  component = RegionCreateUpdateComponent;

  columns: TableColumn<RegionVmForDashboard>[] = [];
  actions: SelectionAction[] = [];

  localized = { ban: null, cancel: null };
  constructor(
    public regionsClient: RegionsClient,
    private _fb: FormBuilder,
    private _dialog: MatDialog,
    private _translateService: TranslateService,
  ) { }

  async ngOnInit(): Promise<any> {
    const status = {
      Active: { name: await this.translate('regions.isActive'), color: 'bg-green' },
      NotActive: { name: await this.translate('regions.isNotActive'), color: 'bg-teal' },
    };

    this.columns = [
      {
        label: 'regions.enName',
        property: 'name.en',
        type: 'text',
        visible: true,
      },
      {
        label: 'regions.arName',
        property: 'name.ar',
        type: 'text',
        visible: true,
      },
      {
        label: 'regions.status',
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
      }
    ];

    this.actions = [
      {
        label: await this.translate('regions.viewSubRegions'),
        ref: this,
        actionName: 'viewSubRegions',
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

  getData(pagingOptions: PagingOptions): Observable<PaginatedListOfRegionVmForDashboard> {

    return this.regionsClient.getPage(
      null,
      pagingOptions.pageSize,
      pagingOptions.pageIndex,
      pagingOptions.query,
      pagingOptions.ascending,
      pagingOptions.sortBy
    );
  }
  
  viewSubRegions(action: SelectionAction, item: RegionVmForDashboard): void {
    this._dialog.open(RegionsComponent, {
      minWidth: this.table.minWidth,
      data: item,
    });
  }

  private translate(key: string): Promise<string> {
    return this._translateService.get(key).toPromise();
  }
}
