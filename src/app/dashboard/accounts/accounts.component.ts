import { ApiHandlerService } from '@core/services/api-handler.service';
import { finalize } from 'rxjs/operators';
import { SelectionAction } from '@core/interfaces/selection-action';
import { TableColumn } from '@core/interfaces/table-column.interface';
import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AioTableComponent } from '@shared/components/widgets/aio-table/aio-table.component';
import {
  AccountsClient,
  AccountVm,
  AccountStatus,
  AccountsBanCommand,
} from '@core/api';
import icBlock from '@iconify/icons-ic/baseline-block';

@Component({
  selector: 'app-accounts',
  template: `<app-aio-table
    #table
    [title]="'users.title' | translate"
    [description]="'users.description' | translate"
    [tableName]="'users.tableName' | translate"
    [tableNamePlural]="'users.tableNamePlural' | translate"
    [client]="accountsClient"
    [columns]="columns"
    [actions]="actions"
  ></app-aio-table>`,
})
export class AccountsComponent implements OnInit {
  @ViewChild('table', { static: false }) table: AioTableComponent<AccountVm>;

  columns: TableColumn<AccountVm>[] = [];
  actions: SelectionAction[] = [];

  localized = { ban: null, cancel: null };

  constructor(
    public accountsClient: AccountsClient,
    private _translateService: TranslateService,
    private _handler: ApiHandlerService
  ) {}

  async ngOnInit(): Promise<any> {
    const statuses = {
      Live: {
        name: await this.translate('users.statuses.live'),
        color: 'bg-green',
      },
      Banned: {
        name: await this.translate('users.statuses.banned'),
        color: 'bg-red',
      },
      Inactive: {
        name: await this.translate('users.statuses.inactive'),
        color: 'bg-deep-orange',
      },
    };

    this.localized.ban = await this.translate('users.ban');
    this.localized.cancel = await this.translate('users.unban');

    this.columns = [
      {
        label: 'users.image',
        property: 'pictureUrl',
        converter: (value: string): string => {
          return value || '/assets/img/default.jpg';
        },
        type: 'image',
        visible: true,
      },
      {
        label: 'users.fullname',
        property: 'fullName',
        type: 'text',
        visible: true,
      },
      {
        label: 'users.username',
        property: 'username',
        type: 'text',
        visible: true,
      },
      {
        label: 'users.phone_number',
        property: 'phoneNumber',
        type: 'text',
        visible: true,
      },
      {
        label: 'users.created_at',
        property: 'createdAt',
        type: 'datetime',
        visible: true,
      },
      {
        label: 'users.status',
        property: 'status',
        converter: (value: AccountStatus): string => {
          return statuses[AccountStatus[value]].name;
        },
        type: 'badge',
        visible: true,
        ngCssClasses: (item: AccountVm): string[] => {
          return [statuses[AccountStatus[item.status]].color];
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
        label: await this.translate('users.ban'),
        ref: this,
        onInitActionName: 'banOnInit',
        actionName: 'ban',
        icon: icBlock,
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

  banOnInit(action: SelectionAction, item: AccountVm): void {
    if (item.status === AccountStatus.Live) {
      action.label = this.localized.ban;
    } else {
      action.label = this.localized.cancel;
    }
  }

  ban(action: SelectionAction, item: AccountVm): void {
    action.loading = true;

    const isBanned = item.status === AccountStatus.Banned;

    this.accountsClient
      .ban(
        new AccountsBanCommand({
          id: item.id,
          ban: !isBanned,
        })
      )
      .pipe(finalize(() => (action.loading = false)))
      .subscribe(
        () => {
          item.status = isBanned ? AccountStatus.Live : AccountStatus.Banned;
          action.label = isBanned ? this.localized.ban : this.localized.cancel;
          this.table.detectChanges();
        },
        (err) => this._handler.handleError(err).pushError()
      );
  }

  private translate(key: string): Promise<string> {
    return this._translateService.get(key).toPromise();
  }
}
