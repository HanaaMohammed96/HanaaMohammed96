import { Injectable } from '@angular/core';
import {
  NavigationDropdown,
  NavigationItem,
} from '../interfaces/navigation-item.interface';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  items: NavigationItem[] = [];

  private _openChangeSubject = new Subject<NavigationDropdown>();
  openChange$ = this._openChangeSubject.asObservable();

  constructor() {}

  triggerOpenChange(item: NavigationDropdown) {
    this._openChangeSubject.next(item);
  }

  isLink(item: NavigationItem): boolean {
    return item.type === 'link';
  }

  isDropdown(item: NavigationItem): boolean {
    return item.type === 'dropdown';
  }

  isSubheading(item: NavigationItem): boolean {
    return item.type === 'subheading';
  }
}
