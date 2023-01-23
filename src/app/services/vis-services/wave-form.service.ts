import { Injectable } from '@angular/core';
import {Interval} from "../../entity/Interval";
import {Line} from "two.js/src/shapes/line";
import {Group} from "two.js/src/group";
import Two from "two.js";

@Injectable({
  providedIn: 'root'
})
export class WaveFormService {

  constructor() {
    this.visData.horizLine.linewidth = 1
    this.visData.horizLine.fill = "#FFFFFF"

  }


  width = 0;
  zoomed = false;
  selected = false;
  zoomPercentage = 0.3;
  samplesPerSecond = 0;
  intervallSeconds = 3;
  currentZoomedOffsetInSec = 0;
  currentData: Array<number> = [];
  originalData: Array<number> = [];

  selectedInterval?: StartEnd;

  visData: VisualElements = {
    horizLine: new Two.Line(0, 100, this.width, 100),
    waveGroup: new Two.Group(),
    intervalzoomer: new Interval({width: this.width}, true,
      this.convSecToPix(this.currentData.length/this.samplesPerSecond*this.zoomPercentage, this.width, this.currentData.length / this.samplesPerSecond)),
    interval: new Interval({width: this.width}, false,
      this.convSecToPix(this.intervallSeconds, this.width, this.currentData.length / this.samplesPerSecond))

  }



  init(samplesPerSecons: number, originalData: Array<number>){
    this.samplesPerSecond = samplesPerSecons;
    this.originalData = originalData;
    this.currentData = originalData;
  }





  drawZoomedWave(posX: number, canvas: Two) {
    // var normalizedDataLeft = this.convPixToDataPoint(leftX - dist )
    // var normalizedDataRight = this.convPixToDataPoint(rightX + dist)

    let left = this.convPixToDataPoint(posX, this.width, this.currentData.length) - this.zoomPercentage*this.currentData.length/2
    let right = this.convPixToDataPoint(posX, this.width, this.currentData.length) + this.zoomPercentage*this.currentData.length/2

    var truncatedArray = this.currentData.slice(left, right)
    var distance = (this.visData.interval?.intervallSize??0) * (this.currentData.length / truncatedArray.length)
    this.currentData = truncatedArray;

    this.drawTwoJs(truncatedArray, true, canvas)
    this.visData.interval?.setPositionAndIntervalSize(this.width/2, distance);
    canvas.play();
    this.zoomed = true
  }


  /**
   * Draws generic waveform
   * @param normalizedData
   * @param zoomed determines what interval selector is used
   * @param two
   */
  drawTwoJs(normalizedData: Array<number>, zoomed = false, two: Two): void {
    // our two js canvas to draw on
    this.width = two.width;
    const width = this.width / normalizedData.length;
    two.remove(this.visData.waveGroup);
    this.visData.waveGroup = new Two.Group();

    two.add(this.visData.horizLine)

    //here we draw the lines
    for (var i = 0; i < normalizedData.length; i++) {
      const x = width * i
      var lineHeight = 100 - normalizedData[i] * 100
      if (i % 2 == 1) {
        lineHeight = 100 + normalizedData[i] * 100
      }
      var line = new Two.Line(x, 100, x, lineHeight)
      line.linewidth = 1
      line.stroke = "#FFFFFF"
      line.noFill()
      this.visData.waveGroup.add(line)
    }

    this.visData.interval?.regenerate({width: this.width},
      this.convSecToPix(this.intervallSeconds, this.width, this.currentData.length / this.samplesPerSecond));


    this.visData.intervalzoomer?.regenerate(
      {width: this.width},
      this.convSecToPix(this.currentData.length/this.samplesPerSecond*this.zoomPercentage, this.width, this.currentData.length / this.samplesPerSecond))

    two.add(this.visData.waveGroup);
    if(zoomed){
      two.remove(this.visData.intervalzoomer!.group);
      two.add(this.visData.interval!.group);
    }
    else{
      two.remove(this.visData.interval!.group);
      two.add(this.visData.intervalzoomer!.group);

    }

    //add the linegroup to the scene



    // let countown = this.visData.waveGroup.children.length;
    // two.bind("update", () => {
    //
    //   let index  = this.visData.waveGroup.children.length - countown;
    //   countown -= 1;
    //   this.visData.waveGroup.children[index].stroke = "red"
    // })

    //this.addZUI()
    two.update()

  }


  // #########################################################################################
  // ############################################ playing ###########################
  // ########################################################################################


  timePlayed(units: number, unitsPerSeconds = 2){
    if(this.selected){
      let start = (this.selectedInterval?.start??0) - this.currentZoomedOffsetInSec
      let fromIndex = Math.floor(this.samplesPerSecond * start);
      let toIndex = Math.floor(this.samplesPerSecond * (start + units/unitsPerSeconds));
      for(let i = fromIndex; i<= toIndex; i++){
        this.visData.waveGroup.children[i].stroke = "red"
      }
    }
    else {
      this.percentagePlayed((units/unitsPerSeconds)/(this.currentData.length / this.samplesPerSecond))
    }
  }

  percentagePlayed(percentage: number){
    let tillIndex = Math.floor(this.visData.waveGroup.children.length * percentage);
    for(let i = 0; i<= tillIndex; i++){
      this.visData.waveGroup.children[i].stroke = "red"
    }
  }


  resetPlayed(two: Two){
    this.drawTwoJs(this.currentData, this.zoomed, two);
  }
  // #########################################################################################
  // ############################################ Changes ###########################
  // #########################################################################################

  /**
   * moves the currenly active intervall
   *
   * @param positionX the position is the center of the intervall
   * @param canvas
   */
  moveIntervall(positionX: number, canvas: Two){
    if (this.zoomed) {
      if(!this.selected){
        this.visData.interval?.move(positionX)
        canvas.update();
      }
    }
    else{
      this.visData.intervalzoomer?.move(positionX)
      canvas.update();
    }
  }

  click(event: any, canvas: Two){
    let positionX = event.x
    if (!this.zoomed) {
      positionX = this.visData.intervalzoomer?.getVertlinePosition()
      this.currentZoomedOffsetInSec = this.convPixToSec(this.visData.intervalzoomer?.getStartLinePosition(), this.width, this.currentData.length, this.samplesPerSecond);
      this.drawZoomedWave(positionX, canvas);
      this.selectedInterval = undefined;

    } else {
      this.selectedInterval = undefined;
      this.selected = !this.selected;
      if(this.selected){
        let start = this.convPixToSec(this.visData.interval?.getStartLinePosition(), this.width, this.currentData.length, this.samplesPerSecond)+this.currentZoomedOffsetInSec;
        let end = this.convPixToSec(this.visData.interval?.getEndlinePosition(), this.width, this.currentData.length, this.samplesPerSecond)+this.currentZoomedOffsetInSec;
        this.selectedInterval = {start: start, end: end};
      }

    }
  }


  /** resets zoom to the original data
   * @param two
   */
  resetZoom(two: Two){
    this.zoomed = false;
    this.selected = false;
    this.currentZoomedOffsetInSec = 0;

    this.currentData = this.originalData;
    this.drawTwoJs(this.currentData, false, two)
    two.update()
  }


  // #########################################################################################
  // ############################################ Helper Converters ###########################
  // #########################################################################################
  convSecToPix(sec: number, totalWidth: number, totalSeconds: number) {
    return sec  * totalWidth/ totalSeconds
  }

  convPixToSec(pixX: number, totalWidth: number, dataLenght: number, samplesPerSecond: number){
    return this.convPixToDataPoint(pixX, totalWidth, dataLenght)/(samplesPerSecond);
  }

  convPixToDataPoint(pixX: number, totalWidth: number,  dataLength: number) {
    return pixX / totalWidth * dataLength
  }

  convDataPointToPix(dataPoint: number, totalWidth: number, dataLength: number) {
    return dataPoint / dataLength * totalWidth
  }


}

export interface StartEnd{
  start: number,
  end: number
}

interface VisualElements{
  intervalzoomer?: Interval;
  interval?: Interval;
  horizLine: Line;
  waveGroup: Group;
}



