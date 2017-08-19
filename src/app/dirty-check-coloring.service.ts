import { ElementRef, Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { DelayedScheduler } from './delayed-scheduler.service';

/**
 * Controls coloring of dirty checked components.
 */
@Injectable()
export class DirtyCheckColoringService {

  private _clearColoring$ = new Subject<void>();
  private _autoClearColoring = true;
  private _delayedScheduler: DelayedScheduler;

  constructor(private _zone: NgZone) {
    this._delayedScheduler = new DelayedScheduler(_zone);
  }

  public clearColoring(): void {
    this._clearColoring$.next();
  }

  public setAutoClearColoring(autoClear: boolean): void {
    this._autoClearColoring = autoClear;
  }

  public isAutoClearColoring(): boolean {
    return this._autoClearColoring;
  }

  public colorDirtyCheck(elementRef: ElementRef): void {
    this._zone.runOutsideAngular(() => {
      const element = elementRef.nativeElement as HTMLElement;
      const cssClass = 'dirty-check';
      this._delayedScheduler.schedule(() => {
        element.classList.add(cssClass);
      });

      if (this._autoClearColoring) {
        this._delayedScheduler.done$
          .take(1) // subscribe once
          .delay(1000) // clear after 1s
          .subscribe(() => element.classList.remove(cssClass));
      } else {
        this._delayedScheduler.done$
          .take(1) // subscribe once
          .delayWhen(() => this._clearColoring$)
          .subscribe(() => element.classList.remove(cssClass));
      }
    });
  }
}
