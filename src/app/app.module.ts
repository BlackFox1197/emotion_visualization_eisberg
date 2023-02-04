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
import { CanvasjsCancerComponent } from './features/iceberg-manual-preview/canvasjs-cancer/canvasjs-cancer.component';
import { HttpClientModule} from "@angular/common/http";
import { MorphingIcebergComponent } from './features/morphing-iceberg/morphing-iceberg.component';
import {MatSelectModule} from "@angular/material/select";
import { IcebergOverviewComponent } from './features/iceberg-overview/iceberg-overview.component';

@NgModule({
  declarations: [
    AppComponent,
    IcebergManualPreviewComponent,
    IcebergComponent,
    InputsComponent,
    AudioVisualizerComponent,
    CanvasjsCancerComponent,
    MorphingIcebergComponent,
    IcebergOverviewComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        FormsModule,
        HttpClientModule,
        MatSelectModule,
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
