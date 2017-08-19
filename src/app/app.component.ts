import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/do';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { AfterViewInit, ApplicationRef, Component, ElementRef, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { NumberHolder } from './number-holder';
import { FormControl } from '@angular/forms';
import { DirtyCheckColoringService } from './dirty-check-coloring.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnDestroy {

  private _destroy$ = new Subject<void>();

  public value = 0;
  public inputByVal: number;
  public inputByRef = new NumberHolder();
  public inputObservable = new Subject<number>();
  public propagateByValue = false;
  public propagateByReference = true;
  public propagateByObservable = true;
  public propagateInZone = true;
  public autoClearDirtyCheckColoringFormControl: FormControl;

  @ViewChild('apptick_button')
  private _apptickButton: ElementRef;

  @ViewChild('timeout_button')
  private _timeout_button: ElementRef;

  @ViewChild('input_value_button')
  private _inputValueButton: ElementRef;

  @ViewChild('clear')
  private _clearButton: ElementRef;

  @ViewChild('input_value_field')
  private _inputValueField: ElementRef;

  constructor(private _zone: NgZone, private _appRef: ApplicationRef, private _dirtyCheckColoringService: DirtyCheckColoringService) {
    this.autoClearDirtyCheckColoringFormControl = new FormControl(_dirtyCheckColoringService.isAutoClearColoring());
  }

  public ngAfterViewInit(): void {
    this._zone.runOutsideAngular(() => {
      // apptick
      Observable.fromEvent(this._apptickButton.nativeElement, 'click')
        .do(() => this._dirtyCheckColoringService.clearColoring())
        .takeUntil(this._destroy$)
        .subscribe(event => this._appRef.tick());

      // timeout
      Observable.fromEvent(this._timeout_button.nativeElement, 'click')
        .takeUntil(this._destroy$)
        .subscribe(event => {
          setTimeout(() => this._zone.run(() => console.log(`setTimeout(...)`)), 3000);
        });

      // clear
      Observable.fromEvent(this._clearButton.nativeElement, 'click')
        .takeUntil(this._destroy$)
        .subscribe(_ => {
          this._dirtyCheckColoringService.clearColoring();
        });

      Observable.fromEvent(this._inputValueButton.nativeElement, 'click')
        .takeUntil(this._destroy$)
        .do(() => this._dirtyCheckColoringService.clearColoring())
        .subscribe(_ => {
          if (this.propagateInZone) {
            this._zone.run(this.updateInputValue.bind(this));
          } else {
            this.updateInputValue();
          }
        });

      this.autoClearDirtyCheckColoringFormControl.valueChanges
        .takeUntil(this._destroy$)
        .subscribe(value => this._dirtyCheckColoringService.setAutoClearColoring(value))
    });
  }

  public ngOnDestroy(): void {
    this._destroy$.complete();
  }

  private updateInputValue(): void {
    this.value++;
    if (this.propagateByValue) {
      this.inputByVal = this.value;
    }
    if (this.propagateByReference) {
      this.inputByRef.value = this.value;
    }
    if (this.propagateByObservable) {
      this.inputObservable.next(this.value);
    }

    // Update DOM directly because outside Angular zone to not trigger change detection
    const valueElement = this._inputValueField.nativeElement as HTMLElement;
    valueElement.innerHTML = (this.value).toString(10);
  }
}
