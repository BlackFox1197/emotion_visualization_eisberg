import { Injectable } from '@angular/core';
import Two from "two.js";

@Injectable({
  providedIn: 'root'
})
export class SpectroService {

  specGroup= new Two.Group

  constructor() { }

  sampleRate = 44100
  bins = 256

  calcFrequencies(sampleRate: number, bins:number){
    // samplerate/bins*currentbin = frequency
    return sampleRate/bins
  }

  drawSpec(freqData: Uint8Array, sampleRate:number){
    const barWidth = 1900
    const calcdBarWidth = barWidth/freqData.length
    let barHeight
    let x=0
    var group = new Two.Group()
    for(let i=0; i<this.bins;i++){
      barHeight = freqData[i]/255
      let rect = new Two.Rectangle(calcdBarWidth*i, 200, calcdBarWidth, barHeight*100)
      rect.visible=true
      rect.fill='red'
      this.specGroup.add(rect)
    }
    return this.specGroup
  }

}
