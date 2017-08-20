import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ExpandCollapseService {

  private _contentChildren$ = new BehaviorSubject<State>(State.Collapse);

  public toggleContentChildren(): void {
    this._contentChildren$.next((this._contentChildren$.getValue() === State.Expand) ? State.Collapse : State.Expand);
  }

  public get contentChildren$(): Observable<State> {
    return this._contentChildren$.asObservable();
  }
}

export enum State {
  Expand, Collapse
}
