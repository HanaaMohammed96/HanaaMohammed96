import {
  NavigationLink,
  NavigationDropdown,
  NavigationSubheading,
} from '@core/interfaces/navigation-item.interface';
import { Component, Renderer2, OnInit } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { NavigationService } from '@core/services/navigation.service';
import { LocalizationService } from '@core/services/localization.service';
import { PreloaderService } from '@core/services/preloader.service';
import icLayers from '@iconify/icons-ic/twotone-layers';
import icUsers from '@iconify/icons-ic/baseline-people-alt';
import icTeam from '@iconify/icons-ic/round-supervised-user-circle';
import icPolicy from '@iconify/icons-ic/baseline-policy';
import { TranslateService } from '@ngx-translate/core';
import icEdit from '@iconify/icons-ic/twotone-edit';
import icPageView from '@iconify/icons-ic/twotone-pageview';
import icReceipt from '@iconify/icons-ic/twotone-receipt';
import icFilterList from '@iconify/icons-ic/twotone-filter-list';
import icMoreVert from '@iconify/icons-ic/store';
import icAssessment from '@iconify/icons-ic/twotone-assessment';
import icBook from '@iconify/icons-ic/twotone-book';
import icAssigment from '@iconify/icons-ic/twotone-assignment';
import icChat from '@iconify/icons-ic/twotone-chat';
import icBusiness from '@iconify/icons-ic/twotone-business';
import icContacts from '@iconify/icons-ic/twotone-contacts';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {
  constructor(
    private renderer: Renderer2,
    private platform: Platform,
    private navigationService: NavigationService,
    private translateService: TranslateService,
    private localizationService: LocalizationService,
    private preloaderService: PreloaderService
  ) {
    if (this.platform.BLINK) {
      this.renderer.addClass(document.body, 'is-blink');
    }

    this.localizationService.localize();
    this.preloaderService.hide();
  }

  async ngOnInit(): Promise<any> {
    await this.setupNavigations();
  }

  async setupNavigations(): Promise<any> {
    this.navigationService.items = [
      {
        type: 'link',
        label: await this.translate('navigations.analytics'),
        route: '/',
        icon: icLayers,
        routerLinkActiveOptions: { exact: true },
      } as NavigationLink,
      {
        type: 'link',
        label: await this.translate('navigations.team'),
        route: '/admins',
        icon: icTeam,
      } as NavigationLink,
      {
        type: 'link',
        label: await this.translate('navigations.partner'),
        route: '/partners',
        icon: icUsers,
      } as NavigationLink,
      {
        type: 'link',
        label: await this.translate('navigations.chat'),
        route: '/chat',
        icon: icChat,
        badge: {
          value: '16',
          bgClass: 'bg-cyan',
          textClass: 'text-cyan-contrast',
        },
      }as NavigationLink,
      {
        type: 'subheading',
        label: await this.translate('navigations.content'),
        icon: icUsers,
        children: [
          {
            type: 'link',
            label: await this.translate('navigations.realState'),
            route: '/real-state',
            icon: icReceipt,
          } as NavigationLink,
          {
            type: 'link',
            label: await this.translate('navigations.country'),
            route: '/country',
            icon: icAssessment,
          }as NavigationLink,
          {
            type: 'link',
            label: await this.translate('navigations.regoins'),
            route: '/regions',
            icon: icMoreVert,
          } as NavigationLink,
          {
            type: 'link',
            label: await this.translate('navigations.form'),
            route: '/forms',
            icon: icFilterList,
          } as NavigationLink,
          {
            type: 'link',
            label: await this.translate('navigations.evaluationMethods'),
            route: '/evaluation-methods',
            icon: icBusiness,
          } as NavigationLink,
          {
            type: 'link',
            label: await this.translate('navigations.questions'),
            route: '/common-question',
            icon: icAssigment,
          } as NavigationLink,
          {
            type: 'link',
            label: await this.translate('navigations.plans'),
            route: '/plans',
            icon: icBook,
          } as NavigationLink,
          {
            type: 'dropdown',
            label: await this.translate('navigations.terms_Cond'),
            icon: icPageView,
            children: [
              {
                type: 'link',
                label: await this.translate('navigations.terms_Cond_ar'),
                route: '/tnc/ar',
              } as NavigationLink,
              {
                type: 'link',
                label: await this.translate('navigations.terms_Cond_en'),
                route: '/tnc/en',
              } as NavigationLink,
            ],
          } as NavigationDropdown,
          {
            type: 'dropdown',
            label: await this.translate('navigations.contact_us'),
            icon: icContacts,
            children: [
              {
                type: 'link',
                label: await this.translate('navigations.contact_us_ar'),
                route: '/contact-us/ar',
              } as NavigationLink,
              {
                type: 'link',
                label: await this.translate('navigations.contact_us_en'),
                route: '/contact-us/en',
              } as NavigationLink,
            ],
          } as NavigationDropdown,
          {
            type: 'dropdown',
            label: await this.translate('navigations.privacy_policy'),
            icon: icPolicy,
            children: [
              {
                type: 'link',
                label: await this.translate('navigations.privacy_policy_ar'),
                route: '/pnp/ar',
              } as NavigationLink,
              {
                type: 'link',
                label: await this.translate('navigations.privacy_policy_en'),
                route: '/pnp/en',
              } as NavigationLink,
            ],
          } as NavigationDropdown,
        ],
      } as NavigationSubheading,
    ];
  }

  translate(key: string): Promise<string> {
    return this.translateService.get(key).toPromise();
  }
}
