import { Component, OnInit } from '@angular/core';
import {IceBergConfig} from "../../entity/IceBergConfig";
import {Color} from "../../entity/Color";
import {Observable} from "rxjs";

@Component({
  selector: 'app-iceberg-manual-preview',
  templateUrl: './iceberg-manual-preview.component.html',
  styleUrls: ['./iceberg-manual-preview.component.scss']
})
export class IcebergManualPreviewComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  icebergConfig: IceBergConfig = {
    color1: new Color('blue'),
    color2: new Color('green'),
    params: {
      skew: 0,
      frequency: 0,
      colorParam: 0,
      borderParam: 0,
      height: 0,
    }
  };


  copyConfig(){
    this.icebergConfig = Object.assign({}, this.icebergConfig);
  }
}
