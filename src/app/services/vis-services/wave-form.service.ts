import { Injectable } from '@angular/core';
import {Interval} from "../../entity/Interval";
import {Line} from "two.js/src/shapes/line";
import {Group} from "two.js/src/group";
import Two from "two.js";
import {Constants} from "two.js/src/constants";
import {Vector} from "two.js/src/vector";
import {add} from "@tweenjs/tween.js";
import {empty, isEmpty} from "rxjs";


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
  selectWOZoom = false

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


  init(samplesPerSecons: number, originalData: Array<number>, zoomPercentage: number){
    this.zoomPercentage = zoomPercentage;
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

  //redraw the fucking intervall for switching the duration
  redraw(intervallSecs: number, two: Two){
    if(this.zoomed||this.selectWOZoom){
      //redraw intervall instantly
      two.remove(this.visData.interval!.group)
      this.intervallSeconds = intervallSecs

      this.regenerateIntervals();
      this.visData.interval?.setPositionAndIntervalSize(this.visData.interval?.getVertlinePosition(), this.visData.interval?.intervallSize)

      this.removeOrAddTwo(true, two, [], [this.visData.interval!.group])
    }else {
      //redraw intervallZoomer instantly
      this.intervallSeconds=intervallSecs
      this.regenerateIntervals();
      this.visData.intervalzoomer?.setPositionAndIntervalSize(this.visData.intervalzoomer?.getVertlinePosition(), this.visData.intervalzoomer?.intervallSize)
      this.removeOrAddTwo(true, two, [this.visData.intervalzoomer!.group], [this.visData.intervalzoomer!.group])
    }
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

    this.regenerateIntervals()

    two.add(this.visData.waveGroup);

    if(zoomed||this.selectWOZoom){
      //two.remove(this.visData.intervalzoomer!.group)
      //two.add(this.visData.interval!.group)
      //two.update()
      this.removeOrAddTwo(true, two, [this.visData.intervalzoomer!.group], [this.visData.interval!.group])
      }
    else{
      //two.remove(this.visData.interval!.group)
      //two.add(this.visData.intervalzoomer!.group)
      //two.update()
      this.removeOrAddTwo(true, two, [this.visData.interval!.group], [this.visData.intervalzoomer!.group])
    }
  }

  regenerateIntervals(){
    this.visData.interval?.regenerate({width: this.width},
      this.convSecToPix(this.intervallSeconds, this.width, this.currentData.length / this.samplesPerSecond));
    this.visData.intervalzoomer?.regenerate(
      {width: this.width},
      this.convSecToPix(this.currentData.length/this.samplesPerSecond*this.zoomPercentage, this.width, this.currentData.length / this.samplesPerSecond))
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
    //TODO: changed this to ceil, instead floor works a little bit better but no 100% fix
    let tillIndex = Math.ceil(this.visData.waveGroup.children.length * percentage);
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
        this.visData.interval?.move(positionX)}}
    else{
      if(this.selectWOZoom&&!this.selected){
        this.visData.interval?.move(positionX)}
      else{
        this.visData.intervalzoomer?.move(positionX)
      }
    }
    canvas.update();
  }

  click(event: any, canvas: Two){
    let positionX = event.x
    if (!this.zoomed && !this.selectWOZoom) {
      positionX = this.visData.intervalzoomer?.getVertlinePosition()
      this.currentZoomedOffsetInSec = this.convPixToSec(this.visData.intervalzoomer?.getStartLinePosition(), this.width, this.currentData.length, this.samplesPerSecond);
      this.drawZoomedWave(positionX, canvas);
      this.selectedInterval = undefined;
    }
    else {
      this.selectedInterval = undefined;
      this.selected = !this.selected;
      if(this.selected){
        let start = this.convPixToSec(this.visData.interval?.getStartLinePosition(), this.width, this.currentData.length, this.samplesPerSecond)+this.currentZoomedOffsetInSec;
        let end = this.convPixToSec(this.visData.interval?.getEndlinePosition(), this.width, this.currentData.length, this.samplesPerSecond)+this.currentZoomedOffsetInSec;
        this.selectedInterval = {start: start, end: end};
      }
    }
  }

  //
  drawWOZoom(two: Two){
    if(this.selectWOZoom){
      this.removeOrAddTwo(false, two, [this.visData.interval!.group, this.visData.intervalzoomer!.group], [])

      this.intervallSeconds = this.intervallSeconds
      //this.regenerateIntervals();

      this.visData.interval?.setPositionAndIntervalSize(this.visData.interval?.getVertlinePosition(), this.visData.interval?.intervallSize)
      two.add(this.visData.interval!.group)

    }
    else {
      this.removeOrAddTwo(false, two, [this.visData.interval!.group], [this.visData.intervalzoomer!.group])
    }
    two.update()

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

  // #########################################################################################
  // ############################################ Remove/Add Interval ###########################
  // #########################################################################################

  /** remove or add stuff to the two, and update it depending on the updateTwo bool
   * @param updateTwo
   * @param two
   * @param removeArr
   * @param addArr
   */
  removeOrAddTwo(updateTwo:boolean=true ,two: Two , removeArr: Array<Group>, addArr: Array<Group>){
    for(let i=0; i<removeArr.length;i++){
        two.remove(removeArr[i])
    }
    for(let i=0; i<addArr.length;i++){
      two.add(addArr[i])
    }
    if(updateTwo){
      two.update()
    }
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



