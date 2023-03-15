import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ControllPage} from "./features/controll-page/controll-page.component";
import {IcebergsEmosComponent} from "./features/icebergs-emos/icebergs-emos.component";
import {RoutesIntern} from "./services/routesIntern";
import {IcebergManualPreviewComponent} from "./features/iceberg-manual-preview/iceberg-manual-preview.component";

const routes: Routes = [
  {path: RoutesIntern.icebergEmos, component: IcebergsEmosComponent},
  {path: '', redirectTo: RoutesIntern.morphingIceberg, pathMatch: 'full'},
  {path: RoutesIntern.morphingIceberg, component: ControllPage},
  {path: RoutesIntern.manualIceberg, component: IcebergManualPreviewComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
