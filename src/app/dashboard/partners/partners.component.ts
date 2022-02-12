import { PagingOptions } from '@core/interfaces/paging-options.interface';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { FilterControl } from '@core/interfaces/filter-control.interface';
import { SelectionAction } from '@core/interfaces/selection-action';
import { TableColumn } from '@core/interfaces/table-column.interface';
import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AioTableComponent } from '@shared/components/widgets/aio-table/aio-table.component';
import {
  AccountsClient,
  AdminVm,
  Role,
  PaginatedListOfAdminVm,
} from '@core/api';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ResetPasswordComponent } from '../team/reset-password/reset-password.component';
import { PartnerCreateUpdateComponent } from './partner-create-update/partner-create-update.component';
import { CountriesRegionsSubRegionsComponent } from './countries-regions-sub-regions/countries-regions-sub-regions.component';

@Component({
  selector: 'app-partners',
  template: `<app-aio-table
    #table
    [ref]="this"
    [title]="'team.title_partner' | translate"
    [description]="'team.description_partner' | translate"
    [tableName]="'team.tableName' | translate"
    [tableNamePlural]="'team.tableNamePlural' | translate"
    [client]="accountsClient"
    [createUpdateComponent]="component"
    [columns]="columns"
    [actions]="actions"
    [dataObserable]="'getData'"
  ></app-aio-table>`,
})
export class PartnersComponent implements OnInit {
  @ViewChild('table', { static: false }) table: AioTableComponent<AdminVm>;

  form: FormGroup;

  component = PartnerCreateUpdateComponent;

  columns: TableColumn<AdminVm>[] = [];
  actions: SelectionAction[] = [];

  localized = { ban: null, cancel: null };
  constructor(
    public accountsClient: AccountsClient,
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
        label: 'team.image',
        property: 'pictureUrl',
        converter: (value: string): string => {
          return value || '/assets/img/default.jpg';
        },
        type: 'image',
        visible: true,
      },
      {
        label: 'team.fullname',
        property: 'fullName',
        type: 'text',
        visible: true,
      },
      {
        label: 'team.created_at',
        property: 'createdAt',
        type: 'datetime',
        visible: true,
      },
      {
        label: 'team.username',
        property: 'username',
        type: 'text',
        visible: true,
      },
      {
        label: 'team.phone_number',
        property: 'phoneNumber',
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
        label: await this.translate('team.showAreas'),
        ref: this,
        actionName: 'showAreas',
        icon: this.table.icEdit,
        disabled: false,
        loading: false,
      },
      {
        label: await this.translate('team.resetPassword'),
        ref: this,
        actionName: 'resetPassword',
        icon: this.table.icEdit,
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
  getData(pagingOptions: PagingOptions): Observable<PaginatedListOfAdminVm> {

    const spId = +this.form.get('serviceProviderId').value;

    return this.accountsClient.getAdminsPage(
      Role.Partner,
      pagingOptions.pageSize,
      pagingOptions.pageIndex,
      pagingOptions.query,
      pagingOptions.ascending,
      pagingOptions.sortBy
    );
  }

  resetPassword(action: SelectionAction, item: AdminVm): void {
    this._dialog.open(ResetPasswordComponent, {
      minWidth: this.table.minWidth,
      data: item,
    });
  }
  showAreas(action: SelectionAction, item: AdminVm): void {
    this._dialog.open(CountriesRegionsSubRegionsComponent, {
      // height: '600px',
      width: '700px',
      autoFocus: false,
      data: item,
    });
  }

  private translate(key: string): Promise<string> {
    return this._translateService.get(key).toPromise();
  }

}
