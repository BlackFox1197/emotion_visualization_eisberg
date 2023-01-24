import { Injectable } from '@angular/core';
import Two from "two.js";

@Injectable({
  providedIn: 'root'
})
export class SpectroService {

  specGroup= new Two.Group

  constructor() { }

  sampleRate = 44100
  bins = 1024

 /*
  function draw() {
    // draw 1 time slice per column
    analyser.getByteFrequencyData(dataArray);
    for (var y = 1; y <= bufferLength; y++) {
      var intensity = dataArray[y - 1];
      canvasCtx.fillStyle = `rgb(${intensity},${intensity},${intensity})`

      var rectY = canvas.height - (bufferLength/10) * Math.log(y)
      var rectYNext = canvas.height - (bufferLength/10) * Math.log(y+1)

      var rectHeight = rectYNext - rectY
      canvasCtx.fillRect(canvas.width - 1, rectY, 1, rectHeight)
    }
    // shift canvas contents left by 1 pixel
    canvasCtx.drawImage(canvasCtx.canvas, -1, 0);
    requestAnimationFrame(draw);
  }

 */

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
