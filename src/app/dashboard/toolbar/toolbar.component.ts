import { map } from 'rxjs/operators';
import { Component, HostBinding, Input, OnInit, ElementRef } from '@angular/core';
import { LayoutService } from '@core/services/layout.service';
import icBookmarks from '@iconify/icons-ic/twotone-bookmarks';
import icMenu from '@iconify/icons-ic/twotone-menu';
import icPersonAdd from '@iconify/icons-ic/twotone-person-add';
import icAssignmentTurnedIn from '@iconify/icons-ic/twotone-assignment-turned-in';
import icBallot from '@iconify/icons-ic/twotone-ballot';
import icDescription from '@iconify/icons-ic/twotone-description';
import icAssignment from '@iconify/icons-ic/twotone-assignment';
import icReceipt from '@iconify/icons-ic/twotone-receipt';
import icDoneAll from '@iconify/icons-ic/twotone-done-all';
import icArrowDropDown from '@iconify/icons-ic/twotone-arrow-drop-down';
import icSearch from '@iconify/icons-ic/twotone-search';
import { LocalizationService } from '@core/services/localization.service';
import { ConfigService } from '@core/services/config.service';
import { NavigationService } from '@core/services/navigation.service';
import { PopoverService } from '@shared/components/popover/popover.service';
import { MegaMenuComponent } from '@shared/components/mega-menu/mega-menu.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  @Input() mobileQuery: boolean;

  @Input()
  @HostBinding('class.shadow-b')
  hasShadow: boolean;

  navigationItems = this.navigationService.items;

  isHorizontalLayout$ = this.configService.config$.pipe(
    map((config) => config.layout === 'horizontal')
  );
  isVerticalLayout$ = this.configService.config$.pipe(
    map((config) => config.layout === 'vertical')
  );
  isNavbarInToolbar$ = this.configService.config$.pipe(
    map((config) => config.navbar.position === 'in-toolbar')
  );
  isNavbarBelowToolbar$ = this.configService.config$.pipe(
    map((config) => config.navbar.position === 'below-toolbar')
  );

  icSearch = icSearch;
  icBookmarks = icBookmarks;
  icMenu = icMenu;
  icPersonAdd = icPersonAdd;
  icAssignmentTurnedIn = icAssignmentTurnedIn;
  icBallot = icBallot;
  icDescription = icDescription;
  icAssignment = icAssignment;
  icReceipt = icReceipt;
  icDoneAll = icDoneAll;
  icArrowDropDown = icArrowDropDown;

  constructor(
    public localizationService: LocalizationService,
    private layoutService: LayoutService,
    private configService: ConfigService,
    private navigationService: NavigationService,
    private popoverService: PopoverService
  ) {}

  ngOnInit() {}

  openQuickpanel() {
    this.layoutService.openQuickpanel();
  }

  openSidenav() {
    this.layoutService.openSidenav();
  }

  openMegaMenu(origin: ElementRef | HTMLElement) {
    this.popoverService.open({
      content: MegaMenuComponent,
      origin,
      position: [
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
        },
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top',
        },
      ],
    });
  }

  openSearch() {
    this.layoutService.openSearch();
  }
}
