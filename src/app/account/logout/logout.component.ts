import { Component } from '@angular/core';
import { IdentityManager } from '@core/auth';

@Component({
  selector: 'app-logout',
  template: ``,
})
export class LogoutComponent {
  constructor(private _identityManger: IdentityManager) {
    this._identityManger.logout(true);
  }
}
