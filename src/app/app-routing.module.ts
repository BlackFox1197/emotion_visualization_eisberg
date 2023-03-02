import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ControllPage} from "./features/controll-page/controll-page.component";
import {IcebergsEmosComponent} from "./features/icebergs-emos/icebergs-emos.component";
import {RoutesIntern} from "./services/routesIntern";

const routes: Routes = [
  {path: RoutesIntern.icebergEmos, component: IcebergsEmosComponent},
  {path: '', redirectTo: RoutesIntern.morphingIceberg, pathMatch: 'full'},
  {path: RoutesIntern.morphingIceberg, component: ControllPage},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
