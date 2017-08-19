import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Comp_1_1_Component } from './comp-tree/comp-1-1.component';
import { Comp_1_Component } from './comp-tree/comp-1.component';
import { Comp_1_1_1_Component } from './comp-tree/comp-1-1-1.component';
import { Comp_1_1_1_1_Component } from './comp-tree/comp-1-1-1-1.component';
import { Comp_1_1_1_2_Component } from './comp-tree/comp-1-1-1-2.component';
import { Comp_1_1_2_Component } from './comp-tree/comp-1-1-2.component';
import { Comp_1_1_2_1_Component } from './comp-tree/comp-1-1-2-1.component';
import { Comp_1_1_2_2_Component } from './comp-tree/comp-1-1-2-2.component';
import { Comp_1_2_Component } from './comp-tree/comp-1-2.component';
import { Comp_1_2_1_1_Component } from 'app/comp-tree/comp-1-2-1-1.component';
import { Comp_1_2_2_Component } from 'app/comp-tree/comp-1-2-2.component';
import { Comp_1_2_1_Component } from './comp-tree/comp-1-2-1.component';
import { Comp_1_2_2_2_Component } from 'app/comp-tree/comp-1-2-2-2.component';
import { Comp_1_2_2_2_2_Component } from 'app/comp-tree/comp-1-2-2-2-2.component';
import { Comp_1_2_2_1_Component } from './comp-tree/comp-1-2-2-1.component';
import { Comp_1_2_2_2_2_1_Component } from './comp-tree/comp-1-2-2-2-2-1.component';
import { Comp_1_2_1_2_Component } from './comp-tree/comp-1-2-1-2.component';
import { Comp_1_2_2_2_1_Component } from './comp-tree/comp-1-2-2-2-1.component';
import { DirtyCheckColoringService } from './dirty-check-coloring.service';

@NgModule({
  declarations: [
    AppComponent,
    Comp_1_Component,
    Comp_1_1_Component,
    Comp_1_1_1_Component,
    Comp_1_1_1_1_Component,
    Comp_1_1_1_2_Component,
    Comp_1_1_2_Component,
    Comp_1_1_2_1_Component,
    Comp_1_1_2_2_Component,
    Comp_1_2_Component,
    Comp_1_2_1_Component,
    Comp_1_2_1_1_Component,
    Comp_1_2_1_2_Component,
    Comp_1_2_2_Component,
    Comp_1_2_2_1_Component,
    Comp_1_2_2_2_Component,
    Comp_1_2_2_2_1_Component,
    Comp_1_2_2_2_2_Component,
    Comp_1_2_2_2_2_1_Component,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    DirtyCheckColoringService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
