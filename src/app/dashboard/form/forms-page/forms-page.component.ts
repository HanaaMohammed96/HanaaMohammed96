import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FormsClient, FormVmForDashboard, PaginatedListOfFormVmForDashboard, RequestType } from '@core/api';
import { PagingOptions } from '@core/interfaces/paging-options.interface';
import { SelectionAction } from '@core/interfaces/selection-action';
import { TableColumn } from '@core/interfaces/table-column.interface';
import { TranslateService } from '@ngx-translate/core';
import { AioTableComponent } from '@shared/components/widgets/aio-table/aio-table.component';
import { Observable } from 'rxjs';
import { FormBuilderComponent } from '../form-builder/form-builder.component';

@Component({
  selector: 'app-forms-page',
  template: `<app-aio-table
    #table
    [ref]="this"
    [title]="'Form.title_table_page' | translate"
    [description]="'Form.description_table_page' | translate"
    [tableName]="'Form.tableName' | translate"
    [tableNamePlural]="'Form.tableNamePlural' | translate"
    [client]="formsClient"
    [createUpdateComponent]="component"    
    [columns]="columns"
    [forForm]="createForm"
    [actions]="actions"
    [dataObserable]="'getData'"
  ></app-aio-table>`,
})
export class FormsPageComponent implements OnInit {

  @ViewChild('table', { static: false }) table: AioTableComponent<FormVmForDashboard>;

  form: FormGroup;

  component = FormBuilderComponent;

  columns: TableColumn<FormVmForDashboard>[] = [];
  actions: SelectionAction[] = [];

  localized = { ban: null, cancel: null };
  
  createForm = true;
  constructor(
    public formsClient: FormsClient,
    private _fb: FormBuilder,
    private _translateService: TranslateService,
  ) {
    this.form = this._fb.group({
      serviceProviderId: [''],
    });
  }

  async ngOnInit(): Promise<any> {
    const types = {
      Preview: { name: await this.translate('Form.types.preview'), color: 'bg-green' },
      Evaluation: { name: await this.translate('Form.types.evaluation'), color: 'bg-teal' },
    };

    this.columns = [
      {
        label: 'Form.enName',
        property: 'name.en',
        type: 'text',
        visible: true,
      },
      {
        label: 'Form.arName',
        property: 'name.ar',
        type: 'text',
        visible: true,
      },
      {
        label: 'Form.RealState',
        property: 'realState',
        type: 'text',
        visible: true,
      },
      {
        label: 'Form.requestsNumber',
        property: 'requestsNumber',
        type: 'text',
        visible: true,
      },
      {
        label: 'Form.type',
        property: 'type',
        converter: (value: RequestType): string => {
          return types[RequestType[value]].name;
        },
        type: 'badge',
        visible: true,
        ngCssClasses: (item: FormVmForDashboard): string[] => {
          return [types[RequestType[item.type]].color];
        },
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
        label: await this.translate('general.updateForm'),
        ref: this.table,
        actionName: 'update',
        icon: this.table.icEdit,
        disabled: false,
        loading: false,
      },
      {
        label: await this.translate('general.deleteForm'),
        ref: this.table,
        actionName: 'delete',
        icon: this.table.icDelete,
        disabled: false,
        loading: false,
      },
    ];
  }

  getData(pagingOptions: PagingOptions): Observable<PaginatedListOfFormVmForDashboard> {

    return this.formsClient.getPage(
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