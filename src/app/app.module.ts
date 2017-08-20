import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Comp_1_Component } from './comp-tree/comp-1.component';
import { Comp_1_1_Component } from './comp-tree/comp-1-1.component';
import { Comp_1_2_Component } from './comp-tree/comp-1-2.component';
import { Comp_1_x_1_Component } from './comp-tree/comp-1-x-1.component';
import { Comp_1_x_1_1_Component } from './comp-tree/comp-1-x-1-1.component';
import { Comp_1_x_1_2_Component } from './comp-tree/comp-1-x-1-2.component';
import { Comp_1_x_1_3_Component } from './comp-tree/comp-1-x-1-3.component';
import { Comp_1_x_1_4_Component } from './comp-tree/comp-1-x-1-4.component';
import { Comp_1_x_2_Component } from 'app/comp-tree/comp-1-x-2.component';
import { Comp_1_x_2_1_Component } from 'app/comp-tree/comp-1-x-2-1.component';
import { Comp_1_x_2_2_Component } from './comp-tree/comp-1-x-2-2.component';
import { Comp_1_x_2_3_Component } from './comp-tree/comp-1-x-2-3.component';
import { Comp_1_x_2_4_Component } from './comp-tree/comp-1-x-2-4.component';
import { Comp_1_x_3_Component } from './comp-tree/comp-1-x-3.component';
import { Comp_1_x_3_1_Component } from 'app/comp-tree/comp-1-x-3-1.component';
import { Comp_1_x_3_2_Component } from './comp-tree/comp-1-x-3-2.component';
import { Comp_1_x_3_3_Component } from './comp-tree/comp-1-x-3-3.component';
import { Comp_1_x_3_4_Component } from './comp-tree/comp-1-x-3-4.component';
import { Comp_1_x_4_Component } from './comp-tree/comp-1-x-4.component';
import { Comp_1_x_4_1_Component } from './comp-tree/comp-1-x-4-1.component';
import { Comp_1_x_4_2_Component } from './comp-tree/comp-1-x-4-2.component';
import { Comp_1_x_4_3_Component } from './comp-tree/comp-1-x-4-3.component';
import { Comp_1_x_4_4_Component } from './comp-tree/comp-1-x-4-4.component';
import { DirtyCheckColoringService } from './dirty-check-coloring.service';
import { ExpandCollapseService } from './expand-collapse.service';

@NgModule({
  declarations: [
    AppComponent,
    Comp_1_Component,
    Comp_1_1_Component,
    Comp_1_2_Component,
    Comp_1_x_1_Component,
    Comp_1_x_1_1_Component,
    Comp_1_x_1_2_Component,
    Comp_1_x_1_3_Component,
    Comp_1_x_1_4_Component,
    Comp_1_x_2_Component,
    Comp_1_x_2_1_Component,
    Comp_1_x_2_2_Component,
    Comp_1_x_2_3_Component,
    Comp_1_x_2_4_Component,
    Comp_1_x_3_Component,
    Comp_1_x_3_1_Component,
    Comp_1_x_3_2_Component,
    Comp_1_x_3_3_Component,
    Comp_1_x_3_4_Component,
    Comp_1_x_4_Component,
    Comp_1_x_4_1_Component,
    Comp_1_x_4_2_Component,
    Comp_1_x_4_3_Component,
    Comp_1_x_4_4_Component
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    DirtyCheckColoringService,
    ExpandCollapseService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
