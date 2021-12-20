import { Icon } from '@visurel/iconify-angular';

export interface NavigationItem {
  type: string;
  route: string | any;
  fragment?: string;
  label: string;
  icon?: Icon;
  routerLinkActiveOptions?: { exact: boolean };
  children: Array<NavigationLink | NavigationDropdown>;
  badge?: {
    value: string;
    bgClass: string;
    textClass: string;
  };
}

export class NavigationLink implements NavigationItem {
  type: 'link';
  route: string | any;
  fragment?: string;
  label: string;
  icon?: Icon;
  routerLinkActiveOptions?: { exact: boolean };
  children: Array<NavigationLink | NavigationDropdown> = [];
  badge?: {
    value: string;
    bgClass: string;
    textClass: string;
  };
}

export class NavigationDropdown implements NavigationItem {
  type: 'dropdown';
  route: string | any;
  fragment?: string = null;
  label: string;
  icon?: Icon;
  routerLinkActiveOptions?: { exact: boolean } = null;
  children: Array<NavigationLink | NavigationDropdown>;
  badge?: {
    value: string;
    bgClass: string;
    textClass: string;
  };
}

export class NavigationSubheading implements NavigationItem {
  type: 'subheading';
  route: string | any;
  fragment?: string = null;
  label: string;
  icon?: Icon;
  routerLinkActiveOptions?: { exact: boolean } = null;
  children: Array<NavigationLink | NavigationDropdown>;
  badge?: {
    value: string;
    bgClass: string;
    textClass: string;
  } = null;
}
