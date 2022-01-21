import { ToolbarSearchComponent } from './toolbar/toolbar-search/toolbar-search.component';
import { FooterComponent } from './footer/footer.component';
import { QuickpanelComponent } from './quickpanel/quickpanel.component';
import { NavigationComponent } from './navigation/navigation.component';
import { ResetPasswordComponent } from './team/reset-password/reset-password.component';
import { QuillModule } from 'ngx-quill';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { LayoutComponent } from './layout.component';
import { ToolbarNotificationsComponent } from './toolbar/toolbar-notifications/toolbar-notifications.component';
import { ToolbarUserComponent } from './toolbar/toolbar-user/toolbar-user.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { DashboardAnalyticsComponent } from './dashboard-analytics/dashboard-analytics.component';
import { ToolbarUserDropdownComponent } from './toolbar/toolbar-user/toolbar-user-dropdown/toolbar-user-dropdown.component';
import { ToolbarNotificationsDropdownComponent } from './toolbar/toolbar-notifications/toolbar-notifications-dropdown/toolbar-notifications-dropdown.component';
import { SidenavItemComponent } from './sidenav/sidenav-item/sidenav-item.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { InternalServerErrorComponent } from './internal-server-error/internal-server-error.component';
import { ForbiddenAccessComponent } from './forbidden-access/forbidden-access.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';
import { TeamComponent } from './team/team.component';
import { TeamCreateUpdateComponent } from './team/team-create-update/team-create-update.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsAndCondtionsComponent } from './terms-and-condtions/terms-and-condtions.component';
import { PartnersComponent } from './partners/partners.component';
import { PartnerCreateUpdateComponent } from './partners/partner-create-update/partner-create-update.component';
import { FormEditorComponent } from './form/form-editor/form-editor.component';
import { FormDetailesComponent } from './form/form-detailes/form-detailes.component';
import { ConfirmDialogComponent } from './form/confirm-dialog/confirm-dialog.component';
import { EditFieldComponent } from './form/edit-field/edit-field.component';
import { RealStatesComponent } from './real-states/real-states.component';
import { RealStateCreateUpdateComponent } from './real-states/real-state-create-update/real-state-create-update.component';
import { FormsPageComponent } from './form/forms-page/forms-page.component';
import { CountryComponent } from './country/country.component';
import { CountryCreateUpdateComponent } from './country/country-create-update/country-create-update.component';
import { EditValueComponent } from './form/edit-value/edit-value.component';
import { SubRegionsComponent } from './sub-regions/sub-regions.component';
import { RegionCreateUpdateComponent } from './regions/region-create-update/region-create-update.component';
import { SubRegionsCreateUpdateComponent } from './sub-regions/sub-regions-create-update/sub-regions-create-update.component';
import { RegionsComponent } from './regions/regions.component';

@NgModule({
  declarations: [
    LayoutComponent,
    SidenavComponent,
    SidenavItemComponent,
    ToolbarNotificationsDropdownComponent,
    ToolbarNotificationsComponent,
    ToolbarSearchComponent,
    ToolbarUserDropdownComponent,
    ToolbarUserComponent,
    ToolbarComponent,
    NavigationComponent,
    QuickpanelComponent,
    FooterComponent,
    DashboardAnalyticsComponent,
    ForbiddenAccessComponent,
    NotFoundComponent,
    InternalServerErrorComponent,
    UpdateProfileComponent,
    UpdatePasswordComponent,
    TeamComponent,
    TeamCreateUpdateComponent,
    ResetPasswordComponent,
    PrivacyPolicyComponent,
    TermsAndCondtionsComponent,
    PartnersComponent,
    PartnerCreateUpdateComponent,
    FormEditorComponent,
    FormDetailesComponent,
    ConfirmDialogComponent,
    EditFieldComponent,
    RealStatesComponent,
    RealStateCreateUpdateComponent,
    CountryComponent,
    FormsPageComponent,
    CountryComponent,
    CountryCreateUpdateComponent,
    EditValueComponent,
    SubRegionsComponent,
    RegionCreateUpdateComponent,
    SubRegionsCreateUpdateComponent,
    RegionsComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    QuillModule.forRoot({
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'], // toggled buttons
          ['blockquote', 'code-block'],

          [{ header: 1 }, { header: 2 }], // custom button values
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
          [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
          [{ direction: 'rtl' }], // text direction

          [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
          [{ header: [1, 2, 3, 4, 5, 6, false] }],

          [{ color: [] }, { background: [] }], // dropdown with defaults from theme
          [{ align: [] }],

          ['clean'], // remove formatting button
        ],
      },
    }),
  ],
  providers: [...DashboardRoutingModule.resolvers],
})
export class DashboardModule {}
