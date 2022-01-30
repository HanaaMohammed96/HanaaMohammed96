import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';

import { LayoutComponent } from './layout.component';
import { AccountRoutingModule } from './account-routing.module';
import { LogoutComponent } from './logout/logout.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ValidateTokenComponent } from './validate-token/validate-token.component';
import { ChangePasswodComponent } from './change-passwod/change-passwod.component';

@NgModule({
  declarations: [
    LayoutComponent,
    LoginComponent,
    LogoutComponent,
    ForgotPasswordComponent,
    ValidateTokenComponent,
    ChangePasswodComponent
  ],
  imports: [CommonModule, AccountRoutingModule, SharedModule],
  providers: [...AccountRoutingModule.resolvers],
})
export class AccountModule { }
