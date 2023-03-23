import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DragDropDirective} from "./Directives/DragDropDirective";



@NgModule({
  declarations: [
    DragDropDirective,
  ],
  exports:[
    DragDropDirective,
  ],
  imports: [
    CommonModule
  ]
})
export class CoreModule { }
