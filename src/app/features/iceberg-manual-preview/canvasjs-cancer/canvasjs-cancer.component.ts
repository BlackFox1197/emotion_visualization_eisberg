import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import Two from "two.js";
import {Line} from "two.js/src/shapes/line";
import {AudioService} from "../../../services/data-service/audio.service";

@Component({
  selector: 'app-canvasjs-cancer',
  templateUrl: './canvasjs-cancer.component.html',
  styleUrls: ['./canvasjs-cancer.component.scss']
})
export class CanvasjsCancerComponent implements OnInit, AfterViewInit {

  canvas?: HTMLCanvasElement = document.querySelector("canvas") ?? undefined;
  ctx?: CanvasRenderingContext2D = this.canvas?.getContext("2d") ?? undefined;

  groupWave = new Two.Group();

  originalData = [];
  zoomedData = [];

  widthDiv = 1900;
  twoCanvas = new Two();
  //the line to move/show
  horizLine = new Two.Line(0, 100, this.widthDiv, 100)
  interval?: Interval;

  clicked = false;
  zoomedIn = false
  @ViewChild('wavTwoJs') myDiv?: ElementRef;

  audioLengthInSec = 0;
  normalizedData: Array<number> = [];
  normalizedDataZoomed: Array<number> = [];


  constructor(private audiService: AudioService) {
    this.horizLine.linewidth = 1
    this.horizLine.fill = "#FFFFFF"
  }


  ngOnInit() {
    this.audioDrawer('/assets/test.mp3')
    //init our lines
    //this.initLines();

  }

  async evToFile(event: any) {
    const file: File = event.target.files[0];
    const fileURL = URL.createObjectURL(file);
    this.audioDrawer(fileURL)

    return event;
  }

  audioDrawer(file: string): void {

    this.audiService.getAudioBufferFromFile(file).then(
      buffer => {
        this.audioLengthInSec = this.audiService.calculateAudioLenght(buffer);
        this.normalizedData =this.audiService.generateDataPoints(buffer);
        this.drawTwoJs(this.normalizedData);
      }
    );

  }


  ngAfterViewInit() {

    var params = {
      fitted: true,
      type: Two.Types.svg
    };
    var elem = this.myDiv?.nativeElement;
    this.twoCanvas = new Two(params).appendTo(elem);
    this.widthDiv = this.myDiv?.nativeElement.clientWidth;


  }

  mouseover(event: any) {
    let positionX = event.x

    if (!this.clicked) {
      this.interval?.move(positionX)
      this.twoCanvas.update();
    }
  }

  click(event: any) {
    let positionX = event.x
    let dist = this.convSecToPix(1.5)
    console.log(dist)
    this.clicked = !this.clicked
    this.interval?.setPositionAndIntervalSize(positionX, dist)
    this.interval!.vertLine.visible = false
    this.twoCanvas.update()

    if (!this.zoomedIn) {
      this.drawZoomedWave(this.interval!.leftLine.vertices[0].x, this.interval!.rightLine.vertices[0].x, positionX, dist);
    } else {
      // this.twoCanvas.remove(this.zoomedWaveGroup)
      // this.twoCanvas.add(this.groupWave)
      this.twoCanvas.update()
      console.log(this.clicked)
    }
  }


  drawZoomedWave(leftX: number, rightX: number, posX: number, dist: number) {
    var normalizedDataLeft = this.convPixToDataPoint(leftX - dist * 10)
    var normalizedDataRight = this.convPixToDataPoint(rightX + dist * 10)


    var truncatedArray = this.normalizedData.slice(normalizedDataLeft, normalizedDataRight)

    var distance = dist * (this.normalizedData.length / truncatedArray.length)
    console.log(distance)

    this.drawTwoJs(truncatedArray)
    this.interval?.setPositionAndIntervalSize(950, distance * 10);
    this.twoCanvas.update();
    this.zoomedIn = true
  }




  drawTwoJs(normalizedData: Array<number>): void {
    // our two js canvas to draw on

    const width = this.widthDiv / normalizedData.length;
    this.twoCanvas.remove(this.groupWave);
    this.groupWave = new Two.Group();

    this.groupWave.add(this.horizLine)

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
      this.groupWave.add(line)
    }

    this.interval = new Interval(this.convSecToPix(3));
    //add the linegroup to the scene
    this.groupWave.add(this.interval!.vertLine)
    this.groupWave.add(this.interval!.leftLine)
    this.groupWave.add(this.interval!.rightLine)
    this.twoCanvas.add(this.groupWave);
    //this.addZUI()
    this.twoCanvas.update()
  }
  //
  // drawZoomedTwoJs(normalizedData: Array<number>) {
  //   // our two js canvas to draw on
  //   const width = this.widthDiv / normalizedData.length;
  //   //this.twoCanvas.remove(this.groupWave)
  //   this.twoCanvas.remove(this.groupWave);
  //   this.groupWave = new Two.Group();
  //
  //   this.groupWave.add(this.horizLine)
  //
  //   //here we draw the lines
  //   for (var i = 0; i < normalizedData.length; i++) {
  //     const x = width * i
  //     var lineHeight = 100 - normalizedData[i] * 100
  //     if (i % 2 == 1) {
  //       lineHeight = 100 + normalizedData[i] * 100
  //     }
  //     var line = new Two.Line(x, 100, x, lineHeight)
  //     line.linewidth = 1
  //     line.stroke = "#FFFFFF"
  //     line.noFill()
  //     this.groupWave.add(line)
  //   }
  //   this.interval = new Interval(this.convSecToPix(3));
  //   this.groupWave.add(this.interval!.vertLine)
  //   this.groupWave.add(this.interval!.leftLine)
  //   this.groupWave.add(this.interval!.rightLine)
  //   this.twoCanvas.add(this.groupWave)
  //   this.twoCanvas.update()
  // }


  convPixToSec(pixX: number) {
    return (pixX * this.normalizedData.length / this.widthDiv) / this.normalizedData.length * this.audioLengthInSec
  }

  convSecToPix(sec: number) {
    return sec  * this.widthDiv/ this.audioLengthInSec
  }

  convPixToDataPoint(pixX: number, dataLength = this.normalizedData.length) {
    return pixX / this.widthDiv * dataLength
  }

  convDataPointToPix(dataPoint: number, dataLength = this.normalizedData.length) {
    return dataPoint / dataLength * this.widthDiv
  }


}


class Interval{
  leftLine: Line =   new Two.Line(0,0,0,200);
  rightLine: Line =   new Two.Line(0,0,0,200);
  vertLine: Line =   new Two.Line(0,0,0,200);


  constructor(public intervallSize: number = 0) {

    this.vertLine.stroke="green"
    this.vertLine.linewidth =3
    this.vertLine.visible =false
    this.leftLine.stroke="red"
    this.leftLine.linewidth =2
    this.leftLine.visible = false
    this.rightLine.stroke="red"
    this.rightLine.linewidth =2
    this.rightLine.visible = false
  }

  setInterVallzize(size: number): void{
    this.intervallSize = size;
  }

  move(positionX: number){
    this._moveLine(this.vertLine, positionX, 0)
    this._moveLine(this.leftLine, positionX, -this.intervallSize/2)
    this._moveLine(this.rightLine, positionX, this.intervallSize/2)
  }

  setPositionAndIntervalSize(positionX: number, size: number){
    this.intervallSize = size;
    this.move(positionX);
  }

  private _moveLine(line: Line, x: number, dist: number) {
    line.visible = true;
    const [anchor1, anchor2] = line.vertices
    anchor1.set(x + dist, anchor1.y)
    anchor2.set(x + dist, anchor2.y)
  }
}
