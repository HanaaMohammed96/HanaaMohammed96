import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';

import { LayoutComponent } from './layout.component';
import { AccountRoutingModule } from './account-routing.module';
import { LogoutComponent } from './logout/logout.component';

@NgModule({
  declarations: [LayoutComponent, LoginComponent, LogoutComponent],
  imports: [CommonModule, AccountRoutingModule, SharedModule],
  providers: [...AccountRoutingModule.resolvers],
})
export class AccountModule {}
