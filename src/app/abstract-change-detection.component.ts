import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, DoCheck, ElementRef, HostBinding, Input, NgZone, OnChanges, OnDestroy, ViewChild, SimpleChanges } from '@angular/core';
import { ColorService } from './color.service';
import { Observable } from 'rxjs/Observable';

import { Subject } from 'rxjs/Subject';
import { NumberHolder } from 'app/number-holder';

import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/takeUntil';

export abstract class AbstractChangeDetectionComponent implements AfterViewInit, OnChanges, DoCheck, OnDestroy {

  private _destroy$ = new Subject<void>();
  private _destroyInputObservable$ = new Subject<void>();

  @ViewChild('mfc_button') // mark for check
  private _mfcButton: ElementRef;

  @ViewChild('dc_button') // detect changes
  private _cdButton: ElementRef;

  @ViewChild('detach_button') // detach change detector
  private _detachButton: ElementRef;

  @ViewChild('attach_button') // attach change detector
  private _attachButton: ElementRef;

  @ViewChild('cd_state_box')
  private _cdStateBox: ElementRef;

  @ViewChild('ng_do_check_box')
  private _ngDoCheckBox: ElementRef;

  @ViewChild('ng_on_changes_box')
  private _ngOnChangesBox: ElementRef;

  @Input()
  public inputByRef: NumberHolder;

  @Input()
  public inputByVal: number;

  @Input()
  public inputObservable: Observable<number>;

  @HostBinding('attr.class')
  private _hostClass;

  public inputObservableValue: number;
  public cdStrategyName: string;

  constructor(public name: string, level: number, private _hostRef: ElementRef, private _colorService: ColorService, private _cd: ChangeDetectorRef, private _zone: NgZone, cdStrategy: ChangeDetectionStrategy) {
    this.cdStrategyName = resolveChangeDetectionStrategyName(cdStrategy);
    this._hostClass = `level-${level}`;
  }

  public ngAfterViewInit(): void {
    this._attachButton.nativeElement.style.display = 'none';

    // install outside Angular zone to not trigger change detection upon button click
    this._zone.runOutsideAngular(() => {
      // Detect Changes manually
      Observable.fromEvent(this._cdButton.nativeElement, 'click')
        .takeUntil(this._destroy$)
        .subscribe(event => {
          console.log(`ChangeDetectorRef.detectChanges() for ${this.name}`);
          this._cd.detectChanges();
        });

      // Mark for check
      Observable.fromEvent(this._mfcButton.nativeElement, 'click')
        .takeUntil(this._destroy$)
        .subscribe(event => {
          console.log(`ChangeDetectorRef.markForCheck() for ${this.name}`);
          this._cd.markForCheck();
        });

      // Detach change detector
      Observable.fromEvent(this._detachButton.nativeElement, 'click')
        .takeUntil(this._destroy$)
        .subscribe(event => {
          console.log(`ChangeDetectorRef.detach() for ${this.name}`);
          this._cd.detach();
          this._colorService.colorChangeDetectorDetached(this._cdStateBox);
          this._detachButton.nativeElement.style.display = 'none'; // because outside Angular zone
          this._attachButton.nativeElement.style.display = 'inline';
        });

      // Attach change detector
      Observable.fromEvent(this._attachButton.nativeElement, 'click')
        .takeUntil(this._destroy$)
        .subscribe(event => {
          console.log(`ChangeDetectorRef.reattach() for ${this.name}`);
          this._cd.reattach();
          this._colorService.colorChangeDetectorAttached(this._cdStateBox);
          this._detachButton.nativeElement.style.display = 'inline'; // because outside Angular zone
          this._attachButton.nativeElement.style.display = 'none';
        });
    });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.inputObservable) {
      this._destroyInputObservable$.next();
      this.inputObservable
        .takeUntil(this._destroy$)
        .takeUntil(this._destroyInputObservable$)
        .subscribe(value => this.inputObservableValue = value);
    }
    this._colorService.colorNgOnChanges(this._ngOnChangesBox);
  }

  public ngDoCheck(): void {
    this._colorService.colorNgDoCheck(this._ngDoCheckBox);
  }

  public ngOnDestroy(): void {
    this._destroy$.complete();
  }

  public get touch(): string {
    this._colorService.colorDirtyCheck(this._hostRef);
    return null;
  }

  public onClick(): void {
    console.log(`Click for ${this.name}`);
  }
}

function resolveChangeDetectionStrategyName(strategy: any): string {
  for (const name in ChangeDetectionStrategy) {
    if ( ChangeDetectionStrategy[name] === strategy && ChangeDetectionStrategy.hasOwnProperty(name) ) {
      return name;
    }
  }

  return undefined;
}

