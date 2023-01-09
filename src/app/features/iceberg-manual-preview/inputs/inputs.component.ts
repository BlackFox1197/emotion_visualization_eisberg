import {Component, OnInit, Output} from '@angular/core';
import {IcebergParams} from "../../../entity/Icebergparams";

@Component({
  selector: 'app-inputs',
  templateUrl: './inputs.component.html',
  styleUrls: ['./inputs.component.scss']
})
export class InputsComponent implements OnInit {

  constructor() { }


  params: IcebergParams = {skew: 0}

  ngOnInit(): void {
  }

}
