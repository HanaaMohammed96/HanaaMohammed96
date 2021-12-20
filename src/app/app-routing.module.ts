import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnauthenticatedGuard, AuthorizeGuard } from '@core/auth';

const routes: Routes = [
  {
    path: 'account',
    canLoad: [UnauthenticatedGuard],
    loadChildren: () => import('./account/account.module').then((m) => m.AccountModule),
  },
  {
    path: '',
    canLoad: [AuthorizeGuard],
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      // preloadingStrategy: PreloadAllModules,
      scrollPositionRestoration: 'enabled',
      relativeLinkResolution: 'corrected',
      anchorScrolling: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
