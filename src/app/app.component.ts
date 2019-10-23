import { Subject, fromEvent } from 'rxjs';
import { AfterViewInit, ApplicationRef, Component, ElementRef, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { map, takeUntil, tap } from 'rxjs/operators';
import { NumberHolder } from './number-holder';
import { DirtyCheckColoringService } from './dirty-check-coloring.service';
import { ExpandCollapseService, State } from './expand-collapse.service';

@Component({
  selector   : 'app-root',
  templateUrl: './app.component.html',
  styleUrls  : ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnDestroy {

  private _destroy$ = new Subject<void>();

  private value = 0;
  private busy = false;
  public inputByVal: number;
  public inputByRef = new NumberHolder();
  public inputObservable = new Subject<number>();

  @ViewChild('apptick_button', { static: true })
  private _apptickButton: ElementRef;

  @ViewChild('timeout_button', { static: true })
  private _timeoutButton: ElementRef;

  @ViewChild('click_button', { static: true })
  private _clickButton: ElementRef;

  @ViewChild('trigger_change', { static: true })
  private _triggerChangeButton: ElementRef;

  @ViewChild('clear', { static: true })
  private _clearButton: ElementRef;

  @ViewChild('auto_clear', { static: true })
  private _autoClearCheckbox: ElementRef;

  @ViewChild('toggle_content_children', { static: true })
  private _toggleContentChildren: ElementRef;

  @ViewChild('input_value_field', { static: true })
  private _inputValueField: ElementRef;

  @ViewChild('propagate_by_value_checkbox', { static: true })
  private _propagateByValueCheckbox: ElementRef;

  @ViewChild('propagate_by_ref_checkbox', { static: true })
  private _propagateByRefCheckbox: ElementRef;

  @ViewChild('propagate_by_observable_checkbox', { static: true })
  private _propagateByObservableCheckbox: ElementRef;

  @ViewChild('propagate_in_zone_checkbox', { static: true })
  private _propagateInZoneCheckbox: ElementRef;

  constructor(private _zone: NgZone, private _appRef: ApplicationRef, private _dirtyCheckColoringService: DirtyCheckColoringService, private _expandCollapseService: ExpandCollapseService) {
  }

  public ngAfterViewInit(): void {
    this._dirtyCheckColoringService.setAutoClearColoring(this.isAutoClear());

    this._zone.runOutsideAngular(() => {
      // apptick
      fromEvent(this._apptickButton.nativeElement, 'click').pipe(
        tap(() => this._dirtyCheckColoringService.clearColoring()),
        takeUntil(this._destroy$)
      )
      .subscribe(event => this._appRef.tick());

      // timeout
      fromEvent(this._timeoutButton.nativeElement, 'click').pipe(
        takeUntil(this._destroy$)
      )
      .subscribe(event => {
        setTimeout(() => this._zone.run(() => console.log(`setTimeout(...)`)), 3000);
      });

      // clear auto checkbox
      fromEvent(this._autoClearCheckbox.nativeElement, 'change').pipe(
        takeUntil(this._destroy$),
        map((event: Event) => event.target as HTMLInputElement)
      )
      .subscribe(element => {
        this._dirtyCheckColoringService.setAutoClearColoring(element.checked);
      });

      // clear
      fromEvent(this._clearButton.nativeElement, 'click').pipe(
        takeUntil(this._destroy$)
      )
      .subscribe(_ => {
        this._dirtyCheckColoringService.clearColoring();
      });

      // Change input
      fromEvent(this._triggerChangeButton.nativeElement, 'click').pipe(
        takeUntil(this._destroy$),
        tap(() => this._dirtyCheckColoringService.clearColoring())
      ).subscribe(_ => {
        if (this.isPropagateInZone()) {
          this._zone.run(this.updateInputValue.bind(this));
        } else {
          this.updateInputValue();
        }
      });

      // Toggle content children
      fromEvent(this._toggleContentChildren.nativeElement, 'click').pipe(
        takeUntil(this._destroy$)
      )
      .subscribe(_ => this._expandCollapseService.toggleContentChildren());

      // Toggle ContentChildren
      this._expandCollapseService.contentChildren$.pipe(
        takeUntil(this._destroy$)
      )
      .subscribe(state => {
        const button = this._toggleContentChildren.nativeElement as HTMLElement;
        button.innerHTML = (state === State.Expand ? 'Collapse ContentChildren' : 'Expand ContentChildren');
      });

      // Busy
      this._dirtyCheckColoringService.busy$.pipe(
        takeUntil(this._destroy$)
      )
      .subscribe(busy => {
        this.busy = busy;
        this._apptickButton.nativeElement.disabled = busy;
        this._timeoutButton.nativeElement.disabled = busy;
        this._clickButton.nativeElement.disabled = busy;
        this._autoClearCheckbox.nativeElement.disabled = busy;
        this._triggerChangeButton.nativeElement.disabled = busy;
        this._propagateByValueCheckbox.nativeElement.disabled = busy;
        this._propagateByRefCheckbox.nativeElement.disabled = busy;
        this._propagateByObservableCheckbox.nativeElement.disabled = busy;
        this._propagateInZoneCheckbox.nativeElement.disabled = busy;
        if (busy && !this._dirtyCheckColoringService.isAutoClearColoring()) {
          this._clearButton.nativeElement.classList.add('emphasize');
        } else {
          this._clearButton.nativeElement.classList.remove('emphasize');
        }
      });
    });
  }

  public clickNoop(): void {
    console.log(`click`);
  }

  public ngOnDestroy(): void {
    this._destroy$.complete();
  }

  private updateInputValue(): void {
    this.value++;
    if (this.isPropagateByValue()) {
      this.inputByVal = this.value;
    }
    if (this.isPropagateByRef()) {
      this.inputByRef.value = this.value;
    }
    if (this.isPropagateByObservable()) {
      this.inputObservable.next(this.value);
    }

    // Update DOM directly because outside Angular zone to not trigger change detection
    const valueElement = this._inputValueField.nativeElement as HTMLElement;
    valueElement.innerHTML = (this.value).toString(10);
  }

  private isAutoClear(): boolean {
    return (this._autoClearCheckbox.nativeElement as HTMLInputElement).checked;
  }

  private isPropagateByValue(): boolean {
    return (this._propagateByValueCheckbox.nativeElement as HTMLInputElement).checked;
  }

  private isPropagateByRef(): boolean {
    return (this._propagateByRefCheckbox.nativeElement as HTMLInputElement).checked;
  }

  private isPropagateByObservable(): boolean {
    return (this._propagateByObservableCheckbox.nativeElement as HTMLInputElement).checked;
  }

  private isPropagateInZone(): boolean {
    return (this._propagateInZoneCheckbox.nativeElement as HTMLInputElement).checked;
  }
}
