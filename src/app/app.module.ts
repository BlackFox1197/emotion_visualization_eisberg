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
import { CanvasjsCancerComponent } from './shared/canvasjs-cancer/canvasjs-cancer.component';
import { HttpClientModule} from "@angular/common/http";
import { MorphingIcebergComponent } from './features/morphing-iceberg/morphing-iceberg.component';
import {MatSelectModule} from "@angular/material/select";
import { IcebergOverviewComponent } from './features/iceberg-overview/iceberg-overview.component';
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

@NgModule({
  declarations: [
    AppComponent,
    IcebergManualPreviewComponent,
    IcebergComponent,
    InputsComponent,
    AudioVisualizerComponent,
    MorphingIcebergComponent,
    IcebergOverviewComponent,
    IcebergsEmosComponent,
    OneIcebergComponent,
    AdminNavigationComponent
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
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
