import { ElementRef, Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { DelayedScheduler } from './delayed-scheduler.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/distinctUntilChanged';

/**
 * Controls coloring of dirty checked components.
 */
@Injectable()
export class DirtyCheckColoringService {

  private _clearColoring$ = new Subject<void>();
  private _autoClearColoring = true;
  private _delayedScheduler: DelayedScheduler;
  private _busy$ = new BehaviorSubject<boolean>(false);

  constructor(private _zone: NgZone) {
    this._delayedScheduler = new DelayedScheduler(_zone);
  }

  public clearColoring(): void {
    this._clearColoring$.next();
  }

  public setAutoClearColoring(autoClear: boolean): void {
    this._autoClearColoring = autoClear;
    if (autoClear) {
      this.clearColoring();
    }
  }

  public isAutoClearColoring(): boolean {
    return this._autoClearColoring;
  }

  public colorDirtyCheck(elementRef: ElementRef): void {
    this._busy$.next(true);
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
          .subscribe(() => {
            element.classList.remove(cssClass);
            this._busy$.next(false);
          });
      } else {
        this._delayedScheduler.done$
          .take(1) // subscribe once
          .delayWhen(() => this._clearColoring$)
          .subscribe(() => {
            element.classList.remove(cssClass);
            this._busy$.next(false);
          });
      }
    });
  }

  public get busy$(): Observable<boolean> {
    return this._busy$.asObservable().distinctUntilChanged();
  }
}
