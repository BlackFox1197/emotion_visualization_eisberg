import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import Two from "two.js";
import {Line} from "two.js/src/shapes/line";
import {AudioService} from "../../../services/data-service/audio.service";

@Component({
  selector: 'app-canvasjs-cancer',
  templateUrl: './canvasjs-cancer.component.html',
  styleUrls: ['./canvasjs-cancer.component.scss']
})
export class CanvasjsCancerComponent implements OnInit{

  canvas?: HTMLCanvasElement = document.querySelector("canvas") ?? undefined;
  ctx?: CanvasRenderingContext2D = this.canvas?.getContext("2d") ?? undefined;

  groupWave = new Two.Group()
  zoomedWaveGroup = new Two.Group()

  widthDiv=1900;
  twoCanvas = new Two();
  //the line to move/show
  horizLine = new Two.Line(0,100, this.widthDiv, 100)
  vertLine = new Two.Line(0,0,0,200)
  leftLine = new Two.Line(0,0,0,200)
  rightLine = new Two.Line(0,0,0,200)

  clicked = false;
  zoomedIn = false
  @ViewChild('wavTwoJs') myDiv?: ElementRef;

  audioLengthInSec = 0;
  normalizedData : Array<number> =[];


  constructor(private audiService: AudioService) {
  }

  mouseover(event: any){
    let positionX = event.x

    if(!this.clicked){
      this.setJsVertLines(positionX, this.convSecToPix(1.5))
    }
  }
  click(event:any){
    let positionX=event.x
    let dist = this.convSecToPix(1.5)
    console.log(dist)
    this.clicked=!this.clicked
    this.setJsVertLines(positionX, dist)
    this.vertLine.visible=false
    this.twoCanvas.update()

    if(!this.zoomedIn){
      this.drawZoomedWave(this.leftLine.vertices[0].x, this.rightLine.vertices[0].x, positionX, dist);
    }else {
      this.twoCanvas.remove(this.zoomedWaveGroup)
      this.twoCanvas.add(this.groupWave)
      this.twoCanvas.update()
      console.log(this.clicked)
    }
  }


  drawZoomedWave(leftX: number, rightX:number,posX: number, dist: number){
    var normalizedDataLeft = this.convPixToDataPoint(leftX-dist*10)
    var normalizedDataRight = this.convPixToDataPoint(rightX+dist*10)


    var truncatedArray = this.normalizedData.slice(normalizedDataLeft, normalizedDataRight)

    var distance=dist*(this.normalizedData.length/truncatedArray.length)
    console.log(distance)

    this.drawZoomedTwoJs(truncatedArray)
    this.setJsVertLines(950,distance*10);
    this.zoomedIn=true
  }

  ngOnInit() {
    this.audioDrawer('/assets/test.mp3')
    //init our lines
    this.initLines();
  }

  async evToFile(event: any){
    //var array = this.onFileSelected(event);
    //this.fileName = event.target.value
    const file:File = event.target.files[0];
    // console.log('file')
    // console.log(file)
    const fileURL = URL.createObjectURL(file);
    this.audioDrawer(fileURL)

    return event;
  }

  audioDrawer(file: string): void{

    this.audiService.getAudioBufferFromFile(file).then(
      buffer => {
        this.audioLengthInSec = this.audiService.calculateAudioLenght(buffer);
        this.drawTwoJs(this.audiService.generateDataPoints(buffer));
      }
    );
    // // Set up audio context
    // const audioContext = new AudioContext();
    //
    // /**
    //  * Retrieves audio from an external source, the initializes the drawing function
    //  * @param {String} url the url of the audio we'd like to fetch
    //  */
    //
    //   fetch(url)
    //     .then(response => response.arrayBuffer())
    //     .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
    //     .then(audioBuffer => this.drawTwoJs(this.normalizeData(this.filterData(audioBuffer))));
  }


  // /**
  //  * Filters the AudioBuffer retrieved from an external source
  //  * @param {AudioBuffer} audioBuffer the AudioBuffer from drawAudio()
  //  * @returns {Array} an array of floating point numbers
  //  */
  // filterData  (audioBuffer: AudioBuffer): Array<any>{
  //   this.audioLengthInSec = audioBuffer.duration
  //   const rawData = audioBuffer.getChannelData(0); // We only need to work with one channel of data
  //   const samples = 3000; // Number of samples we want to have in our final data set
  //   const blockSize = Math.floor(rawData.length / samples); // the number of samples in each subdivision
  //   const filteredData = [];
  //   for (let i = 0; i < samples; i++) {
  //     let blockStart = blockSize * i; // the location of the first sample in the block
  //     let sum = 0;
  //     for (let j = 0; j < blockSize; j++) {
  //       sum = sum + Math.abs(rawData[blockStart + j]); // find the sum of all the samples in the block
  //     }
  //     filteredData.push(sum / blockSize); // divide the sum by the block size to get the average
  //   }
  //   return filteredData;
  // };

  // /**
  //  * Normalizes the audio data to make a cleaner illustration
  //  * @param {Array} filteredData the data from filterData()
  //  * @returns {Array} an normalized array of floating point numbers
  //  */
  // normalizeData (filteredData: Array<any>): Array<any> {
  //   const multiplier = Math.pow(Math.max(...filteredData), -1);
  //   return filteredData.map(n => n * multiplier);
  // }

  drawTwoJs(normalizedData: Array<number>): void{
    // our two js canvas to draw on
    this.normalizedData = normalizedData
    var params = {
      fitted: true
    };
    var elem = this.myDiv?.nativeElement;
    this.twoCanvas = new Two(params).appendTo(elem);
    const width = this.widthDiv / normalizedData.length;

    this.groupWave.add(this.horizLine)

    //here we draw the lines
    for(var i=0; i<normalizedData.length;i++){
      const x = width*i
      var lineHeight =100- normalizedData[i]*100
      if(i%2==1){
        lineHeight = 100 +normalizedData[i]*100
      }
      var line = new Two.Line(x,100,x, lineHeight)
      line.linewidth =1
      line.stroke = "#FFFFFF"
      line.noFill()
      this.groupWave.add(line)
    }

    //add the linegroup to the scene
    this.groupWave.add(this.vertLine)
    this.groupWave.add(this.leftLine)
    this.groupWave.add(this.rightLine)
    this.twoCanvas.add(this.groupWave);
    //this.addZUI()
    this.twoCanvas.update()
  }

  drawZoomedTwoJs(normalizedData: Array<number>) {
    // our two js canvas to draw on
    const width = this.widthDiv / normalizedData.length;
    this.twoCanvas.remove(this.groupWave)

    this.zoomedWaveGroup.add(this.horizLine)

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
      this.zoomedWaveGroup.add(line)
    }
    this.zoomedWaveGroup.add(this.vertLine)
    this.zoomedWaveGroup.add(this.leftLine)
    this.zoomedWaveGroup.add(this.rightLine)
    this.twoCanvas.add(this.zoomedWaveGroup)
    this.twoCanvas.update()
  }

  setJsVertLines(x: number, dist: number){
    this.moveLine(this.vertLine, x, 0)
    this.moveLine(this.leftLine, x, -dist)
    this.moveLine(this.rightLine, x, dist)
    this.twoCanvas.update()
  }

  convPixToSec(pixX:number){
    return (pixX*this.normalizedData.length/this.widthDiv)/this.normalizedData.length*this.audioLengthInSec
  }

  convSecToPix(sec:number){
    return sec/this.normalizedData.length*this.widthDiv*this.normalizedData.length/this.audioLengthInSec
  }

  convPixToDataPoint(pixX:number, dataLength = this.normalizedData.length){
    return pixX/this.widthDiv*dataLength
  }

  convDataPointToPix(dataPoint:number, dataLength= this.normalizedData.length){
    return  dataPoint/dataLength*this.widthDiv
  }

  moveLine(line: Line, x: number, dist: number){
    line.visible=true;
    const[anchor1, anchor2] = line.vertices
    anchor1.set(x+dist, anchor1.y)
    anchor2.set(x+dist, anchor2.y)
    this.twoCanvas.update()
  }
  private initLines() {
    this.vertLine.stroke="green"
    this.vertLine.linewidth =3
    this.vertLine.visible =false

    this.horizLine.linewidth =1
    this.horizLine.fill = "#FFFFFF"

    this.leftLine.stroke="red"
    this.leftLine.linewidth =2
    this.leftLine.visible = false
    this.rightLine.stroke="red"
    this.rightLine.linewidth =2
    this.rightLine.visible = false
  }








  /**
   * A utility function for drawing our line segments
   * @param {AudioContext} ctx the audio context
   * @param {number} x  the x coordinate of the beginning of the line segment
   * @param {number} height the desired height of the line segment
   * @param {number} width the desired width of the line segment
   * @param {boolean} isEven whether or not the segmented is even-numbered
   */
  drawLineSegment(ctx: any, x: number, height: number, width:number, isEven:boolean): void {
    ctx.lineWidth = 1; // how thick the line is
    ctx.strokeStyle = "#ffffff"; // what color our line is
    ctx.beginPath();
    height = isEven ? height : -height;
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    //ctx.arc(x + width / 2, height, width / 2, Math.PI, 0, isEven);
    ctx.lineTo(x + width, 0);
    ctx.stroke();
  };


  drawLineSegment2(ctx: any, x: number, height: number, width:number, isEven:boolean): void {
    ctx.lineWidth = 5; // how thick the line is
    ctx.strokeStyle = "#FF0000"; // what color our line is
    ctx.beginPath();
    height = isEven ? height : -height;
    ctx.moveTo(x, -x);
    ctx.lineTo(x, height);
    //ctx.arc(x + width / 2, height, width / 2, Math.PI, 0, isEven);
    ctx.lineTo(x + width, 100);
    ctx.stroke();
  };

  /**
   * Draws the audio file into a canvas element.
   * @param {Array} normalizedData The filtered array returned from filterData()
   * @returns {Array} a normalized array of data
   */
  draw (normalizedData: Array<any>): void {
    // set up the canvas
    this.canvas = document.querySelector("canvas") ?? new HTMLCanvasElement();
    const dpr = window.devicePixelRatio || 1;
    const padding = 5;
    this.canvas.width = this.canvas.offsetWidth * dpr;
    this.canvas.height = (this.canvas.offsetHeight + padding * 2) * dpr;
    this.ctx = this.canvas.getContext("2d")!;
    const ctx = this.ctx;
    ctx.scale(dpr, dpr);
    ctx.translate(0, this.canvas.offsetHeight / 2 + padding); // set Y = 0 to be in the middle of the canvas

    // draw the line segments
    const width = this.canvas.offsetWidth / normalizedData.length;
    for (let i = 0; i < normalizedData.length; i++) {
      const x = width * i;
      let height = normalizedData[i] * this.canvas.offsetHeight - padding;
      if (height < 0) {
        height = 0;
      } else if (height > this.canvas.offsetHeight / 2) {
        height = this.canvas.offsetHeight / 2;
      }
      this.drawLineSegment(ctx, x, height, width, (i + 1) % 2 == 0);
    }
    this.drawLineSegment2(ctx, 300, 300, width, false);
    this.drawLineSegment2(ctx, 400, 300, width, false);
  };
}
