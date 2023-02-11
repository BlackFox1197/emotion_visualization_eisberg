import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FileDragComponent} from "./file-drag/file-drag.component";
import {CanvasjsCancerComponent} from "./canvasjs-cancer/canvasjs-cancer.component";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatSliderModule} from "@angular/material/slider";
import {MatButtonModule} from "@angular/material/button";
import {CoreModule} from "../core/core.module";
import { LoadingAnimComponent } from './animations/loading-anim/loading-anim.component';



@NgModule({
  declarations: [
    FileDragComponent,
    CanvasjsCancerComponent,
    LoadingAnimComponent
  ],
  exports: [
    CanvasjsCancerComponent
  ],
  imports: [
    CoreModule,
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSliderModule,
    MatButtonModule
  ]
})
export class SharedModule { }
