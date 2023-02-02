import { Injectable } from '@angular/core';
import {IcebergParams} from "../../entity/Icebergparams";
import {IceBergConfig} from "../../entity/IceBergConfig";
import {Color} from "../../entity/Color";
import {ModelOutput} from "../../entity/ModelOutput";

@Injectable({
  providedIn: 'root'
})
export class MorphService {

  constructor() { }

  //calulates the current index of our json TODO: the lefttime for delaying the tween needs to be calculated properly
  calcCurrentIcebergIndex(currentSec: number, durationInSec: number, outputCount: number, oneIcebergDuration: number){
    var indexFloat =this.secToIceberg(currentSec, durationInSec, outputCount)
    var leftTimeNextIce = (Math.ceil(indexFloat)-indexFloat)*oneIcebergDuration/1000*durationInSec/currentSec;
    return [leftTimeNextIce* oneIcebergDuration/1000*durationInSec/currentSec, Math.ceil(indexFloat)]
  }

  //calculate our current iceberg index as float
  secToIceberg(currentSec: number, durationInSec: number, outputCount: number){
    return currentSec/durationInSec*outputCount
  }

  //generate the iceconfs and params from the jsons we got and pass them
  genIceConfs(jsonArray: Array<ModelOutput>, counterJson: number){
    const iceBergParamsOld: IcebergParams = {
      skew: jsonArray[counterJson].x1,
      colorParam: jsonArray[counterJson].x2,
      height: jsonArray[counterJson].x3,
      frequency: jsonArray[counterJson].x4,
      borderParam: 1,
    };

    counterJson++;

    const iceBergParamsNew: IcebergParams = {
      skew: jsonArray[counterJson].x1,
      colorParam: jsonArray[counterJson].x2,
      height: jsonArray[counterJson].x3,
      frequency: jsonArray[counterJson].x4,
      borderParam: 1,
    };

    const iceConfigOld: IceBergConfig = {
      color1: new Color('blue'),
      color2: new Color('green'),
      params: iceBergParamsOld
    };

    const iceConfigNew: IceBergConfig = {
      color1: new Color('blue'),
      color2: new Color('green'),
      params: iceBergParamsNew
    };

    return [iceConfigOld, iceConfigNew]
  }
}
