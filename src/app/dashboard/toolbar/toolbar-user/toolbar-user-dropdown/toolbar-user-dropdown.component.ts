import { IdentityManager } from '@core/auth';
import { AccountDto } from '@core/api';
import { MatDialog } from '@angular/material/dialog';
import { StyleService, Style } from '@core/services/style.service';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { trackById } from '@core/utils/track-by';
import icPerson from '@iconify/icons-ic/twotone-person';
import icSettings from '@iconify/icons-ic/twotone-settings';
import icChevronRight from '@iconify/icons-ic/twotone-chevron-right';
import icArrowDropDown from '@iconify/icons-ic/twotone-arrow-drop-down';
import icBusiness from '@iconify/icons-ic/twotone-business';
import icVerifiedUser from '@iconify/icons-ic/twotone-verified-user';
import icLock from '@iconify/icons-ic/twotone-lock';
import icNotificationsOff from '@iconify/icons-ic/twotone-notifications-off';
import { PopoverRef } from '@shared/components/popover/popover-ref';
import { MenuItem } from '../interfaces/menu-item.interface';
import { UpdateProfileComponent } from 'src/app/dashboard/update-profile/update-profile.component';
import { UpdatePasswordComponent } from 'src/app/dashboard/update-password/update-password.component';
import { Observable } from 'rxjs';
import { UpdatePhoneNumberComponent } from 'src/app/dashboard/update-phone-number/update-phone-number.component';
import { Icon } from '@visurel/iconify-angular';

export interface OnlineStatus {
  id: 'online' | 'away' | 'dnd' | 'offline';
  label: string;
  icon: Icon;
  colorClass: string;
}

@Component({
  selector: 'app-toolbar-user-dropdown',
  templateUrl: './toolbar-user-dropdown.component.html',
  styleUrls: ['./toolbar-user-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarUserDropdownComponent {
  user$: Observable<AccountDto>;

  trackById = trackById;
  icPerson = icPerson;
  icSettings = icSettings;
  icChevronRight = icChevronRight;
  icArrowDropDown = icArrowDropDown;
  icBusiness = icBusiness;
  icVerifiedUser = icVerifiedUser;
  icLock = icLock;
  icNotificationsOff = icNotificationsOff;

  Style = Style;

  selectedStyle$ = this._styleService.style$;

  items: MenuItem[] = [
    {
      id: 1,
      icon: icBusiness,
      label: 'toolbar.update_profile',
      colorClass: 'text-teal',
    },
    {
      id: 2,
      icon: icVerifiedUser,
      label: 'toolbar.change_phone_number',
      colorClass: 'text-primary',
    },
    {
      id: 3,
      icon: icLock,
      label: 'toolbar.change_password',
      colorClass: 'text-amber',
    },
  ];

  constructor(
    private _identityManager: IdentityManager,
    private _dialog: MatDialog,
    private _popoverRef: PopoverRef<ToolbarUserDropdownComponent>,
    private _styleService: StyleService
  ) {
    this.user$ = this._identityManager.account$.asObservable();
  }

  enableDarkMode(): void {
    this._styleService.setStyle(Style.dark);
  }

  disableDarkMode(): void {
    this._styleService.setStyle(Style.default);
  }

  onMenuItemClicked(index: number): void {
    this.close();

    let component = null;

    switch (index) {
      case 1:
        component = UpdateProfileComponent;
        break;

      case 2:
        component = UpdatePhoneNumberComponent;
        break;

      case 3:
        component = UpdatePasswordComponent;
        break;

      default:
        return;
    }

    this._dialog.open(component, {
      minWidth: '400px',
    });
  }

  close(): void {
    this._popoverRef.close();
  }
}
