import { Icon } from '@visurel/iconify-angular';

export interface MenuItem {
  id: number;
  icon: Icon;
  label: string;
  description?: string;
  colorClass: string;
  route?: string;
}
