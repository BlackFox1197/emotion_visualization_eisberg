import { Injectable } from '@angular/core';
import {catchError, min} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TimeUtilsService {

  constructor() { }

  convSecToMinutesAndSec(seconds: number|string){
    if(typeof seconds == "string"){
      var castedSecs = Number(seconds)
      if(Number.isNaN(castedSecs)){
        return "0:00"
      }

    }else{
      var castedSecs = seconds
    }
    var leftSecs = castedSecs%60
    var minutes = Math.floor(castedSecs/60)
    if(minutes>=1){
      if(leftSecs>=10){
        return minutes.toString().concat(":" + leftSecs.toFixed(1))
      }
      return minutes.toString().concat(":0" + leftSecs.toFixed(1))
    }else{
      if(leftSecs>=10){
        return "0:".concat(leftSecs.toString())
      }
      return "0:0".concat(leftSecs.toString())
    }
    /*if(leftSecs<=0){
      return "0:0".concat(leftSecs.toString())
    }else {
      if(leftSecs>=10){
        return minutes.toString().concat(":" + leftSecs.toString())
      }else {
        return minutes.toString().concat(":0" + leftSecs.toString())
      }
    }

     */
  }

}
