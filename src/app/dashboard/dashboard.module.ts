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
import { UpdatePhoneNumberComponent } from './update-phone-number/update-phone-number.component';
import { CountriesRegionsSubRegionsComponent } from './partners/countries-regions-sub-regions/countries-regions-sub-regions.component';
import { CommonQuestionsComponent } from './commonQuestions/commonQuestions.component';
import { CommonQuestionsCreateUpdateComponent } from './commonQuestions/commonQuestionsCreateUpdate/commonQuestionsCreateUpdate.component';
import { ContactusComponent } from './contactus/contactus.component';
import { ShowFormComponent } from './form/show-form/show-form.component';
import { DropZoneComponent } from './form/form-builder/drop-zone/drop-zone.component';
import { DragableZoneComponent } from './form/form-builder/dragable-zone/dragable-zone.component';
import { FormBuilderComponent } from './form/form-builder/form-builder.component';
import { PricePlansComponent } from './price-plans/price-plans.component';
import { PricePlansCreateUpdateComponent } from './price-plans/price-plans-create-update/price-plans-create-update.component';
import { FormEditorComponent } from './form/form-editor/form-editor.component';
import { DropDownComponent } from './form/form-editor/atoms/drop-down/drop-down.component';
import { FileComponent } from './form/form-editor/atoms/file/file.component';
import { RadioButtonComponent } from './form/form-editor/atoms/radio-button/radio-button.component';
import { TextComponent } from './form/form-editor/atoms/text-number-date-time/text.component';
import { TextareaComponent } from './form/form-editor/atoms/textarea/textarea.component';
import { CheckboxComponent } from './form/form-editor/atoms/checkbox/checkbox.component';
import { EvaluationMethodsComponent } from './evaluation-methods/evaluation-methods.component';
import { EvaluationMethodsCreateUpdateComponent } from './evaluation-methods/evaluation-methods-create-update/evaluation-methods-create-update.component';
import { SubEvaluationMethodsComponent } from './sub-evaluation-methods/sub-evaluation-methods.component';
import { SubEvaluationMethodsCreateUpdateIsComponent } from './sub-evaluation-methods/sub-evaluation-methods-create-update-is/sub-evaluation-methods-create-update-is.component';




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
    RegionsComponent,
    UpdatePhoneNumberComponent,
    CountriesRegionsSubRegionsComponent,
    CommonQuestionsComponent,
    CommonQuestionsCreateUpdateComponent,
    FormBuilderComponent,
    DragableZoneComponent,
    DropZoneComponent,
    CheckboxComponent,
    DropDownComponent,
    FileComponent,
    RadioButtonComponent,
    TextComponent,
    TextareaComponent,
    ContactusComponent,
    ShowFormComponent,
    PricePlansComponent,
    PricePlansCreateUpdateComponent,
    FormEditorComponent,
    EvaluationMethodsComponent,
    EvaluationMethodsCreateUpdateComponent,
    SubEvaluationMethodsComponent,
    SubEvaluationMethodsCreateUpdateIsComponent
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

          ['link', 'image', 'video']         // link and image, video
        ],
      },
    }),
  ],
  providers: [...DashboardRoutingModule.resolvers],
})
export class DashboardModule { }
