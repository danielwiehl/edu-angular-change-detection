import { ElementRef, Injectable, NgZone } from '@angular/core';

import 'rxjs/add/operator/delayWhen';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/take';
import { DirtyCheckColoringService } from './dirty-check-coloring.service';

@Injectable()
export class ColorService {

  private ngDoCheckHandle: any;
  private ngOnChangesHandle: any;

  constructor(private _zone: NgZone, private _dirtyCheckColoringService: DirtyCheckColoringService) {
  }

  public colorNgDoCheck(elementRef: ElementRef): void {
    this._zone.runOutsideAngular(() => {
      clearTimeout(this.ngDoCheckHandle);
      this.ngDoCheckHandle = this.blink(elementRef.nativeElement as HTMLElement, 'ng-do-check');
    });
  }

  public colorNgOnChanges(elementRef: ElementRef): void {
    this._zone.runOutsideAngular(() => {
      clearTimeout(this.ngOnChangesHandle);
      this.ngOnChangesHandle = this.blink(elementRef.nativeElement as HTMLElement, 'ng-on-changes');
    });
  }

  public colorDirtyCheck(elementRef: ElementRef): void {
    this._zone.runOutsideAngular(() => {
      this._dirtyCheckColoringService.colorDirtyCheck(elementRef);
    });
  }

  public colorChangeDetectorDetached(hostRef: ElementRef): void {
    this._zone.runOutsideAngular(() => {
      const host = hostRef.nativeElement as HTMLElement;
      host.classList.add('cd-detached');
    });
  }

  public colorChangeDetectorAttached(hostRef: ElementRef): void {
    this._zone.runOutsideAngular(() => {
      const host = hostRef.nativeElement as HTMLElement;
      host.classList.remove('cd-detached');
    });
  }

  private blink(element: HTMLElement, cssClass: string): any {
    element.classList.add(cssClass);
    return setTimeout(() => element.classList.remove(cssClass), 1500);
  }
}
