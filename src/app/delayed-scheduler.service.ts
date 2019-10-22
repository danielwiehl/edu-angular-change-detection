import { NgZone } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export type Fn = () => void;

/**
 * Executes the scheduled functions in sequence with a specific delay.
 */
export class DelayedScheduler {

  private static readonly DELAY = 75;

  private _queue: Fn[] = [];
  private _done$ = new Subject<void>();

  constructor(private _zone: NgZone) {
  }

  public schedule(fn: Fn): void {
    this._queue.push(fn);
    if (this._queue.length === 1) {
      this.scheduleInternal(0);
    }
  }

  public get done$(): Observable<void> {
    return this._done$.asObservable();
  }

  private onTick(): void {
    this._queue.shift()();
    if (this._queue.length > 0) {
      this.scheduleInternal(DelayedScheduler.DELAY);
    } else {
      this._done$.next();
    }
  }

  private scheduleInternal(millis: number): void {
    this._zone.runOutsideAngular(() => {
      setTimeout(this.onTick.bind(this), millis);
    });
  }
}
