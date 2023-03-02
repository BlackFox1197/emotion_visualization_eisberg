import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IcebergManualPreviewComponent } from './features/iceberg-manual-preview/iceberg-manual-preview.component';
import { IcebergComponent } from './features/iceberg-manual-preview/iceberg/iceberg.component';
import { InputsComponent } from './features/iceberg-manual-preview/inputs/inputs.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {FormsModule} from "@angular/forms";
import { AudioVisualizerComponent } from './features/iceberg-manual-preview/audio-visualizer/audio-visualizer.component';
import { CanvasjsCancerComponent } from './shared/components/canvasjs-cancer/canvasjs-cancer.component';
import { HttpClientModule} from "@angular/common/http";
import { ControllPage } from './features/controll-page/controll-page.component';
import {MatSelectModule} from "@angular/material/select";
import { IcebergOverviewComponent } from './features/controll-page/iceberg-overview/iceberg-overview.component';
import {ScrollingModule} from "@angular/cdk/scrolling";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatSliderModule} from "@angular/material/slider";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatSidenavModule} from "@angular/material/sidenav";
import { IcebergsEmosComponent } from './features/icebergs-emos/icebergs-emos.component';
import { OneIcebergComponent } from './features/icebergs-emos/one-iceberg/one-iceberg.component';
import {AdminNavigationComponent} from "./features/navigation/admin-navigation.component";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatListModule} from "@angular/material/list";
import {SharedModule} from "./shared/shared.module";
import {NgChartsModule} from "ng2-charts";
import {MatTooltipModule} from "@angular/material/tooltip";
import { MorphingSingleIcebergComponent } from './features/controll-page/morphing-single-iceberg/morphing-single-iceberg.component';
import {MatTabsModule} from "@angular/material/tabs";

@NgModule({
    declarations: [
        AppComponent,
        IcebergManualPreviewComponent,
        IcebergComponent,
        InputsComponent,
        AudioVisualizerComponent,
        ControllPage,
        IcebergOverviewComponent,
        IcebergsEmosComponent,
        OneIcebergComponent,
        AdminNavigationComponent,
        MorphingSingleIcebergComponent,
        MorphingSingleIcebergComponent
    ],
  imports: [
    SharedModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    HttpClientModule,
    MatSelectModule,
    ScrollingModule,
    MatCheckboxModule,
    MatSliderModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    NgChartsModule,
    MatTooltipModule,
    MatTabsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
