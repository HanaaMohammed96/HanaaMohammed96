import { Directive } from '@angular/core';

@Directive({
  selector: '[ngPageLayoutContent],ng-page-layout-content',
  host: {
    class: 'ng-page-layout-content',
  },
})
export class PageLayoutContentDirective {
  constructor() {}
}
