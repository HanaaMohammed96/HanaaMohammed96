import { Component, OnInit } from '@angular/core';
import icLayers from '@iconify/icons-ic/twotone-layers';
import icAssigment from '@iconify/icons-ic/twotone-assignment';
import { Icon } from '@visurel/iconify-angular';
import icContactSupport from '@iconify/icons-ic/twotone-contact-support';
import icContacts from '@iconify/icons-ic/twotone-contacts';
import icAssessment from '@iconify/icons-ic/twotone-assessment';
import icBook from '@iconify/icons-ic/twotone-book';
import { PopoverRef } from '../popover/popover-ref';

export interface MegaMenuFeature {
  icon: Icon;
  label: string;
  route: string;
}

export interface MegaMenuPage {
  label: string;
  route: string;
}

@Component({
  selector: 'app-mega-menu',
  templateUrl: './mega-menu.component.html',
})
export class MegaMenuComponent implements OnInit {
  features: MegaMenuFeature[] = [
    {
      icon: icLayers,
      label: 'megaMenu.dashboard',
      route: '/',
    },
    {
      icon: icAssigment,
      label: 'megaMenu.aio-Table',
      route: '/apps/aio-table',
    },
    {
      icon: icContactSupport,
      label: 'megaMenu.helpCenter',
      route: '/apps/help-center',
    },
    {
      icon: icContacts,
      label: 'megaMenu.contacts',
      route: '/apps/contacts/grid',
    },
    {
      icon: icAssessment,
      label: 'megaMenu.scrumboard',
      route: '/apps/scrumboard/1',
    },
    {
      icon: icBook,
      label: 'megaMenu.documentation',
      route: '/documentation',
    },
  ];

  pages: MegaMenuPage[] = [
    {
      label: 'megaMenu.allInOneTable',
      route: '/apps/aio-table',
    },
    {
      label: 'megaMenu.authentication',
      route: '/login',
    },
    {
      label: 'megaMenu.components',
      route: '/ui/components/overview',
    },
    {
      label: 'megaMenu.documentation',
      route: '/documentation',
    },
    {
      label: 'megaMenu.faq',
      route: '/pages/faq',
    },
    {
      label: 'megaMenu.formElements',
      route: '/ui/forms/form-elements',
    },
    {
      label: 'megaMenu.formWizard',
      route: '/ui/forms/form-wizard',
    },
    {
      label: 'megaMenu.guides',
      route: '/pages/guides',
    },
    {
      label: 'megaMenu.helpCenter',
      route: '/apps/help-center',
    },
    {
      label: 'megaMenu.scrumboard',
      route: '/apps/scrumboard',
    },
  ];

  constructor(private popoverRef: PopoverRef<MegaMenuComponent>) {}

  ngOnInit() {}

  close() {
    this.popoverRef.close();
  }
}
