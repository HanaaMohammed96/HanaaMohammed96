import { Directive } from '@angular/core';

@Directive({
  selector: '[ngPageLayoutHeader],ng-page-layout-header',
  host: {
    class: 'ng-page-layout-header',
  },
})
export class PageLayoutHeaderDirective {
  constructor() {}
}
