import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostBinding, NgZone, Renderer, Renderer2 } from '@angular/core';
import { ColorService } from '../color.service';
import { AbstractChangeDetectionComponent } from '../abstract-change-detection.component';
import { template } from '../change-detection.component.template';

const NAME = 'comp-1-2-1-2';
const LEVEL = 4;
const CD_STRATEGY = ChangeDetectionStrategy.Default;
const CHILD_TEMPLATE = `
`;

@Component({
  selector: `app-${NAME}`,
  template: template(CHILD_TEMPLATE),
  styleUrls: ['./../change-detection.component.scss'],
  providers: [ColorService],
  changeDetection: CD_STRATEGY
})
export class Comp_1_2_1_2_Component extends AbstractChangeDetectionComponent { // tslint:disable-line:class-name

  constructor(hostRef: ElementRef, colorService: ColorService, cd: ChangeDetectorRef, zone: NgZone) {
    super(NAME, LEVEL, hostRef, colorService, cd, zone, CD_STRATEGY);
  }
}
