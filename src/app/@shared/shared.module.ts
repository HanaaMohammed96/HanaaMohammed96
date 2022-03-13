import { SearchComponent } from './components/search/search.component';
import { HttpClientModule } from '@angular/common/http';
import { FilterDialogComponent } from './components/widgets/aio-table/filter-dialog/filter-dialog.component';
import { ToastrModule } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { IconModule } from '@visurel/iconify-angular';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { PIPES } from './pipes';
import { MaterialModule } from './material.module';

import { PageLayoutContentDirective } from './directives/page-layout-content.directive';
import { PageLayoutHeaderDirective } from './directives/page-layout-header.directive';

import { ChartComponent } from './components/chart/chart.component';
import { NavigationItemComponent } from './components/navigation-item/navigation-item.component';
import { PageLayoutComponent } from './components/page-layout/page-layout.component';
import { PopoverComponent } from './components/popover/popover.component';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { ScrollbarComponent } from './components/scrollbar/scrollbar.component';
import { ShareBottomSheetComponent } from './components/share-bottom-sheet/share-bottom-sheet.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

import { WidgetAssistantComponent } from './components/widgets/widget-assistant/widget-assistant.component';
import { WidgetLargeChartComponent } from './components/widgets/widget-large-chart/widget-large-chart.component';
import { WidgetLargeGoalChartComponent } from './components/widgets/widget-large-goal-chart/widget-large-goal-chart.component';
import { WidgetQuickLineChartComponent } from './components/widgets/widget-quick-line-chart/widget-quick-line-chart.component';
import { WidgetQuickValueCenterComponent } from './components/widgets/widget-quick-value-center/widget-quick-value-center.component';
import { WidgetQuickValueStartComponent } from './components/widgets/widget-quick-value-start/widget-quick-value-start.component';
import { WidgetTableComponent } from './components/widgets/widget-table/widget-table.component';
import { AioTableComponent } from './components/widgets/aio-table/aio-table.component';
import { FormDialogComponent } from './components/form-dialog/form-dialog.component';
import { FormFieldComponent } from './components/form-field/form-field.component';
import { MegaMenuComponent } from './components/mega-menu/mega-menu.component';
import { CountryFlagComponent } from './components/country-flag/country-flag.component';

const LOCAL_DIRECTIVES = [];

const SHARED_DIRECTIVES = [PageLayoutHeaderDirective, PageLayoutContentDirective];

const LOCAL_COMPONENTS = [];

const SHARED_COMPONENTS = [
  ChartComponent,
  NavigationItemComponent,
  PageLayoutComponent,
  PopoverComponent,
  ProgressBarComponent,
  ScrollbarComponent,
  ShareBottomSheetComponent,
  SidebarComponent,
  FormDialogComponent,
  FormFieldComponent,
  FilterDialogComponent,
  SearchComponent,
  MegaMenuComponent,
  CountryFlagComponent
];

const WIDGETS = [
  WidgetAssistantComponent,
  WidgetLargeChartComponent,
  WidgetLargeGoalChartComponent,
  WidgetQuickLineChartComponent,
  WidgetQuickValueCenterComponent,
  WidgetQuickValueStartComponent,
  WidgetTableComponent,
  AioTableComponent,
];

const THIRD_MODULES = [
  MaterialModule,
  FlexLayoutModule,
  IconModule,
  LoadingBarModule,
  LoadingBarRouterModule,
  TranslateModule,
  ToastrModule,
];

const COMMON_MODULES = [
  CommonModule,
  FormsModule,
  RouterModule,
  ReactiveFormsModule,
  HttpClientModule,
];

@NgModule({
  declarations: [
    ...PIPES,
    ...SHARED_COMPONENTS,
    ...LOCAL_COMPONENTS,
    ...LOCAL_DIRECTIVES,
    ...SHARED_DIRECTIVES,
    ...WIDGETS,
  ],
  imports: [...COMMON_MODULES, ...THIRD_MODULES],
  exports: [
    ...PIPES,
    ...SHARED_COMPONENTS,
    ...COMMON_MODULES,
    ...THIRD_MODULES,
    ...SHARED_DIRECTIVES,
    ...WIDGETS,
  ],
})
export class SharedModule {}
