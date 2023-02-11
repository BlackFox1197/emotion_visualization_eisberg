import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MorphingIcebergComponent} from "./features/morphing-iceberg/morphing-iceberg.component";
import {IcebergsEmosComponent} from "./features/icebergs-emos/icebergs-emos.component";
import {RoutesIntern} from "./services/routesIntern";

const routes: Routes = [
  {path: '', redirectTo: RoutesIntern.morphingIceberg, pathMatch: 'full'},
  {path: RoutesIntern.morphingIceberg, component: MorphingIcebergComponent},
  {path: RoutesIntern.icebergEmos, component: IcebergsEmosComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
