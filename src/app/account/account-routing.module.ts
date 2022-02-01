import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChangePasswodComponent } from './change-passwod/change-passwod.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

import { LayoutComponent } from './layout.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { ValidateTokenComponent } from './validate-token/validate-token.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'logout', component: LogoutComponent },
      { path: 'forget', component: ForgotPasswordComponent },
      { path: 'validate', component: ValidateTokenComponent },
      { path: 'change-password', component: ChangePasswodComponent },
      { path: '**', redirectTo: 'login' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule {
  static resolvers = [];
}
