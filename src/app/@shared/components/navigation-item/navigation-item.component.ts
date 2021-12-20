import { Component, Input, OnInit } from '@angular/core';
import {
  NavigationItem,
  NavigationLink,
} from '@core/interfaces/navigation-item.interface';
import { filter, map, startWith } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { NavigationService } from '@core/services/navigation.service';
import { trackByRoute } from '@core/utils/track-by';

@Component({
  selector: 'app-navigation-item',
  templateUrl: './navigation-item.component.html',
  styleUrls: ['./navigation-item.component.scss'],
})
export class NavigationItemComponent {
  @Input() item: NavigationItem;

  isActive$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    startWith(),
    map(() => (item: NavigationItem) => this.hasActiveChilds(item))
  );

  isLink = this.navigationService.isLink;
  isDropdown = this.navigationService.isDropdown;
  isSubheading = this.navigationService.isSubheading;
  trackByRoute = trackByRoute;

  constructor(private navigationService: NavigationService, private router: Router) {}

  hasActiveChilds(parent: NavigationItem): boolean {
    if (this.isLink(parent)) {
      return this.router.isActive(parent.route as string, true);
    }

    if (this.isDropdown(parent) || this.isSubheading(parent)) {
      return parent.children.some((child) => {
        if (this.isDropdown(child)) {
          return this.hasActiveChilds(child);
        }

        if (this.isLink(child) && !this.isFunction(child.route)) {
          return this.router.isActive(child.route as string, true);
        }

        return false;
      });
    }

    return false;
  }

  isFunction(prop: NavigationLink['route']) {
    return prop instanceof Function;
  }
}
