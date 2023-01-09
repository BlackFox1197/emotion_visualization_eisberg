import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {IcebergParams} from "../../../entity/Icebergparams";

@Component({
  selector: 'app-inputs',
  templateUrl: './inputs.component.html',
  styleUrls: ['./inputs.component.scss']
})
export class InputsComponent implements OnInit {

  constructor() { }

  @Output() updateSkew: EventEmitter<number> = new EventEmitter<number>();
  @Output() updateColorPara: EventEmitter<number> = new EventEmitter<number>();
  @Output() updateFrequency: EventEmitter<number> = new EventEmitter<number>();
  @Output() updateBorder: EventEmitter<number> = new EventEmitter<number>();

  params: IcebergParams = {}

  ngOnInit(): void {
  }


  evToNu(event: any): number{
    return event.target.value as number;
  }

}
