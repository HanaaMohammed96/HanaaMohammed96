import { AnimationBuilder, style, animate } from '@angular/animations';
import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PreloaderService {
  constructor(private router: Router, private animationBuilder: AnimationBuilder) {}

  hide(): void {
    const splashScreenElem = document.body.querySelector('#app-splash-screen');

    if (splashScreenElem) {
      this.router.events
        .pipe(
          filter((event) => event instanceof NavigationEnd),
          take(1)
        )
        .subscribe(() => {
          const player = this.animationBuilder
            .build([
              style({
                opacity: 1,
              }),
              animate(
                '400ms cubic-bezier(0.25, 0.8, 0.25, 1)',
                style({
                  opacity: 0,
                })
              ),
            ])
            .create(splashScreenElem);

          player.onDone(() => splashScreenElem.remove());
          player.play();
        });
    }
  }
}
