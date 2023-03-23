import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FileDragComponent} from "./components/file-drag/file-drag.component";
import {CanvasjsCancerComponent} from "./components/canvasjs-cancer/canvasjs-cancer.component";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatSliderModule} from "@angular/material/slider";
import {MatButtonModule} from "@angular/material/button";
import {CoreModule} from "../core/core.module";
import { LoadingAnimComponent } from './animations/loading-anim/loading-anim.component';
import { EmoChartComponent } from './components/emo-chart/emo-chart.component';
import {NgChartsModule} from "ng2-charts";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";


@NgModule({
  declarations: [
    FileDragComponent,
    CanvasjsCancerComponent,
    LoadingAnimComponent,
    EmoChartComponent,
  ],
  exports: [
    CanvasjsCancerComponent,
    EmoChartComponent,
    LoadingAnimComponent,
  ],
    imports: [
        CoreModule,
        CommonModule,
        MatIconModule,
        MatFormFieldModule,
        MatSelectModule,
        MatCheckboxModule,
        MatSliderModule,
        MatButtonModule,
        NgChartsModule,
        MatTooltipModule,
        MatProgressSpinnerModule
    ]
})
export class SharedModule { }
