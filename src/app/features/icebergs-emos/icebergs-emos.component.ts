import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BackendService} from "../../services/backend-service/backend.service";
import Two from "two.js";
import {ModelOutput} from "../../entity/ModelOutput";
import {IcebergParams} from "../../entity/Icebergparams";
import {IceBergConfig} from "../../entity/IceBergConfig";
import {Color} from "../../entity/Color";
import {EisbergService} from "../../services/vis-services/eisberg.service";
import {isEmpty} from "rxjs";

@Component({
  selector: 'app-icebergs-emos',
  templateUrl: './icebergs-emos.component.html',
  styleUrls: ['./icebergs-emos.component.scss']
})
export class IcebergsEmosComponent implements OnInit {
  @ViewChild('icebergsEmos') myDiv?: ElementRef;

  public emosArray: Array<any> =[];
  isLoadin = true;

  constructor(private es: EisbergService, private backend: BackendService) { }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void{
    this.backend.loadIcebergsFor7Emos().subscribe(
      (next) => {
        this.emosArray = next
        this.emosArray = this.emosArray.slice(0,7)
        this.emosArray= this.genIceConfs(this.emosArray);
        this.isLoadin = false
      }
    )
  }

  genIceConfs(arr: Array<ModelOutput>) : Array<IceBergConfig>{
    let icebergConfs = [];

    for(let i=0; i<arr.length; i++){
      let iceParam: IcebergParams = {
        skew: arr[i].x1,
        colorParam: arr[i].x2,
        height: arr[i].x3,
        frequency: arr[i].x4,
        borderParam: 1,
      };

      let iceConf: IceBergConfig = {
        color1: new Color('blue'),
        color2: new Color('green'),
        params: iceParam
      }

      icebergConfs.push(iceConf);
    }
    return icebergConfs;
  }
}
