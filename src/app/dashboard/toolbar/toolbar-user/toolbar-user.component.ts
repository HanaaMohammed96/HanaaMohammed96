import { IdentityManager } from '@core/auth';
import { AccountsClient, AccountDto } from '@core/api';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { PopoverService } from '@shared/components/popover/popover.service';
import { ToolbarUserDropdownComponent } from './toolbar-user-dropdown/toolbar-user-dropdown.component';
import icPerson from '@iconify/icons-ic/twotone-person';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-toolbar-user',
  templateUrl: './toolbar-user.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarUserComponent implements OnInit {
  dropdownOpen: boolean;
  icPerson = icPerson;

  user$: Observable<AccountDto>;

  constructor(
    private _identityManager: IdentityManager,
    private _popover: PopoverService,
    private _cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.user$ = this._identityManager.account$.asObservable();
  }

  showPopover(originRef: HTMLElement) {
    this.dropdownOpen = true;
    this._cd.markForCheck();

    const popoverRef = this._popover.open({
      content: ToolbarUserDropdownComponent,
      origin: originRef,
      offsetY: 12,
      position: [
        {
          originX: 'center',
          originY: 'top',
          overlayX: 'center',
          overlayY: 'bottom',
        },
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top',
        },
      ],
    });

    popoverRef.afterClosed$.subscribe(() => {
      this.dropdownOpen = false;
      this._cd.markForCheck();
    });
  }
}
