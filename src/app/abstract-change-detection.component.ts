import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, DoCheck, ElementRef, HostBinding, Input, NgZone, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import { ColorService } from './color.service';
import { Observable } from 'rxjs/Observable';

import { Subject } from 'rxjs/Subject';
import { NumberHolder } from 'app/number-holder';

import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/filter';
import { DirtyCheckColoringService } from './dirty-check-coloring.service';
import { ExpandCollapseService, State } from './expand-collapse.service';

export abstract class AbstractChangeDetectionComponent implements AfterViewInit, OnChanges, DoCheck, OnDestroy {

  private _destroy$ = new Subject<void>();
  private _destroyInputObservable$ = new Subject<void>();
  private _expandCollapseState = State.Expand;
  private _childType = ChildType.ViewChild;

  @ViewChild('component')
  private _componentField: ElementRef;

  @ViewChild('mfc_button') // mark for check
  private _mfcButton: ElementRef;

  @ViewChild('dc_button') // detect changes
  private _dcButton: ElementRef;

  @ViewChild('detach_button') // detach change detector
  private _detachButton: ElementRef;

  @ViewChild('attach_button') // attach change detector
  private _attachButton: ElementRef;

  @ViewChild('click_button') // attach change detector
  private _clickButton: ElementRef;

  @ViewChild('toggle_visiblity')
  private _toggleVisiblity: ElementRef;

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

  @Input()
  public set contentChild(contentChild: boolean) {
    this._childType = contentChild ? ChildType.ContentChild : ChildType.ViewChild;
  }

  @HostBinding('attr.class')
  public get hostClass(): string {
    const childType = (this._childType === ChildType.ViewChild ? 'view-child' : 'content-child');
    return `${this.cdStrategyName} ${childType} level-${this._level}`;
  }

  public inputObservableValue: number;
  public cdStrategyName: string;

  constructor(public name: string, private _level: number, private _hostRef: ElementRef, private _colorService: ColorService, private _dirtyCheckColoringService: DirtyCheckColoringService, private _expandCollapseService: ExpandCollapseService, private _cd: ChangeDetectorRef, private _zone: NgZone, cdStrategy: ChangeDetectionStrategy) {
    this.cdStrategyName = resolveChangeDetectionStrategyName(cdStrategy);
  }

  public ngAfterViewInit(): void {
    this._attachButton.nativeElement.style.display = 'none';

    // install outside Angular zone to not trigger change detection upon button click
    this._zone.runOutsideAngular(() => {
      // Detect Changes manually
      Observable.fromEvent(this._dcButton.nativeElement, 'click')
        .takeUntil(this._destroy$)
        .do(() => this._dirtyCheckColoringService.clearColoring())
        .subscribe(event => {
          console.log(`ChangeDetectorRef.detectChanges() for ${this.name}`);
          this._cd.detectChanges();
        });

      // Mark for check
      Observable.fromEvent(this._mfcButton.nativeElement, 'click')
        .takeUntil(this._destroy$)
        .do(() => this._dirtyCheckColoringService.clearColoring())
        .subscribe(event => {
          console.log(`ChangeDetectorRef.markForCheck() for ${this.name}`);
          this._cd.markForCheck();
        });

      // Detach change detector
      Observable.fromEvent(this._detachButton.nativeElement, 'click')
        .takeUntil(this._destroy$)
        .do(() => this._dirtyCheckColoringService.clearColoring())
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
        .do(() => this._dirtyCheckColoringService.clearColoring())
        .subscribe(event => {
          console.log(`ChangeDetectorRef.reattach() for ${this.name}`);
          this._cd.reattach();
          this._colorService.colorChangeDetectorAttached(this._cdStateBox);
          this._detachButton.nativeElement.style.display = 'inline'; // because outside Angular zone
          this._attachButton.nativeElement.style.display = 'none';
        });

      // Toggle visibility
      Observable.fromEvent(this._toggleVisiblity.nativeElement, 'click')
        .takeUntil(this._destroy$)
        .subscribe(event => {
          const toggledState = (this._expandCollapseState === State.Expand ? State.Collapse : State.Expand);
          this.setExpandCollapseState(toggledState);
        });

      this._dirtyCheckColoringService.busy$
        .takeUntil(this._destroy$)
        .subscribe(busy => {
          this._dcButton.nativeElement.disabled = busy;
          this._mfcButton.nativeElement.disabled = busy;
          this._attachButton.nativeElement.disabled = busy;
          this._detachButton.nativeElement.disabled = busy;
          this._clickButton.nativeElement.disabled = busy;
        });

      this._expandCollapseService.contentChildren$
        .takeUntil(this._destroy$)
        .filter(_ => this._childType === ChildType.ContentChild)
        .subscribe(state => this.setExpandCollapseState(state));
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

  private setExpandCollapseState(state: State): void {
    this._expandCollapseState = state;
    if (state === State.Expand) {
      this._componentField.nativeElement.style.display = 'inline';
      this._toggleVisiblity.nativeElement.innerHTML = '-';
    } else {
      this._componentField.nativeElement.style.display = 'none';
      this._toggleVisiblity.nativeElement.innerHTML = '+';
    }
  }
}

function resolveChangeDetectionStrategyName(strategy: any): string {
  for (const name in ChangeDetectionStrategy) {
    if (ChangeDetectionStrategy[name] === strategy && ChangeDetectionStrategy.hasOwnProperty(name)) {
      return name;
    }
  }

  return undefined;
}

enum ChildType {
  ViewChild, ContentChild
}
