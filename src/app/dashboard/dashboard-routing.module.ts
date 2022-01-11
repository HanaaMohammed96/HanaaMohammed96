import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { DashboardAnalyticsComponent } from './dashboard-analytics/dashboard-analytics.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { InternalServerErrorComponent } from './internal-server-error/internal-server-error.component';
import { ForbiddenAccessComponent } from './forbidden-access/forbidden-access.component';
import { AccountsComponent } from './accounts/accounts.component';
import { TeamComponent } from './team/team.component';
import { TermsAndCondtionsComponent } from './terms-and-condtions/terms-and-condtions.component';
import { PartnersComponent } from './partners/partners.component';
import { FormEditorComponent } from './form/form-editor/form-editor.component';
import { RealStatesComponent } from './real-states/real-states.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: DashboardAnalyticsComponent },
      { path: '403', component: ForbiddenAccessComponent },
      { path: '404', component: NotFoundComponent },
      { path: '500', component: InternalServerErrorComponent },
      { path: 'users', component: AccountsComponent },
      { path: 'admins', component: TeamComponent },
      { path: 'real-state', component: RealStatesComponent },
      { path: 'partners', component: PartnersComponent },
      { path: 'form-editor', component: FormEditorComponent },
      { path: 'pnp/:lang', component: PrivacyPolicyComponent },
      { path: 'tnc/:lang', component: TermsAndCondtionsComponent },
      { path: '**', component: NotFoundComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {
  static resolvers = [];
}
