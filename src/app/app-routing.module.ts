import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MorphingIcebergComponent} from "./features/morphing-iceberg/morphing-iceberg.component";
import {IcebergsEmosComponent} from "./features/icebergs-emos/icebergs-emos.component";

const routes: Routes = [
  {path: 'morphing-iceberg', component: MorphingIcebergComponent},
  {path: 'icebergs-emos', component: IcebergsEmosComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
