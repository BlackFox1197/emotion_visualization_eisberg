import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import Two from "two.js";
import {Line} from "two.js/src/shapes/line";
import {AudioService} from "../../../services/data-service/audio.service";
import {Interval} from "../../../entity/Interval";
import {WaveFormService} from "../../../services/vis-services/wave-form.service";

@Component({
  selector: 'app-canvasjs-cancer',
  templateUrl: './canvasjs-cancer.component.html',
  styleUrls: ['./canvasjs-cancer.component.scss']
})
export class CanvasjsCancerComponent implements OnInit, AfterViewInit {

  groupWave = new Two.Group();


  widthDiv = 1900;
  twoCanvas = new Two();
  //the line to move/show
  horizLine = new Two.Line(0, 100, this.widthDiv, 100)
  zoomdistance = 0.3;
  intervalzoomer?: Interval;
  interval?: Interval;

  clicked = false;
  zoomedIn = false;

  @ViewChild('wavTwoJs') myDiv?: ElementRef;

  sampleCount = 3000;
  audioLengthInSec = 0;
  audioBuffer?: AudioBuffer;
  samplesPerSecond?: number;
  currentLength = 0;
  currentTruncation: number[] = [];
  currentOffsetInSec = 0;
  intervalSeconds = 3;
  normalizedData: Array<number> = [];
  normalizedDataZoomed: Array<number> = [];
  audioSrc = ''


  constructor(private audiService: AudioService, private  waveFormService: WaveFormService) {
    this.horizLine.linewidth = 1
    this.horizLine.fill = "#FFFFFF"
  }


  ngOnInit() {
    this.audioDrawer('/assets/test.mp3')

  }

  async evToFile(event: any) {
    const file: File = event.target.files[0];
    const fileURL = URL.createObjectURL(file);
    this.audioDrawer(fileURL)

    return event;
  }

  audioDrawer(file: string): void {
    this.audioSrc = file;
    this.audiService.getAudioBufferFromFile(file).then(
      buffer => {
        this.audioBuffer = buffer;
        this.audioLengthInSec = this.audiService.calculateAudioLenght(buffer);
        this.currentLength = this.audioLengthInSec;
        this.normalizedData =this.audiService.generateDataPoints(buffer, this.sampleCount);
        this.samplesPerSecond = this.sampleCount / this.audioLengthInSec;
        this.waveFormService.init(this.samplesPerSecond, this.normalizedData);
        this.waveFormService.drawTwoJs(this.normalizedData, false, this.twoCanvas);
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
    this.waveFormService.moveIntervall(event.x, this.twoCanvas);
  }

  // @HostListener('document:keydown.escape', ['$event']) unzoom(event: KeyboardEvent) {
  //   this.zoomedIn = false;
  //   this.drawTwoJs(this.normalizedData)
  //   this.twoCanvas.update()
  //   this.clicked = false;
  //   this.currentLength = this.audioLengthInSec;
  //   this.currentOffsetInSec = 0;
  // }
  //
  click(event: any) {
    let retVal = this.waveFormService.click(event, this.twoCanvas)
    if(retVal != null){
      this.audiService.playSelection(this.audioBuffer!, retVal.start, retVal.end-retVal.start);
    }
  }

  //
  // drawZoomedWave(posX: number, dist: number) {
  //   // var normalizedDataLeft = this.convPixToDataPoint(leftX - dist )
  //   // var normalizedDataRight = this.convPixToDataPoint(rightX + dist)
  //
  //   let left = this.convPixToDataPoint(posX) - this.zoomdistance*this.normalizedData.length/2
  //   let right = this.convPixToDataPoint(posX) + this.zoomdistance*this.normalizedData.length/2
  //
  //   console.log(this.normalizedData.length, left, right)
  //   var truncatedArray = this.normalizedData.slice(left, right)
  //   this.currentLength = truncatedArray.length / (this.samplesPerSecond??1);
  //   this.currentTruncation = truncatedArray;
  //   var distance = (this.interval?.intervallSize??0) * (this.normalizedData.length / truncatedArray.length)
  //
  //   this.drawTwoJs(truncatedArray, true)
  //   this.interval?.setPositionAndIntervalSize(this.widthDiv/2, distance);
  //   this.twoCanvas.play();
  //   this.zoomedIn = true
  // }
  //
  //
  //
  //
  // drawTwoJs(normalizedData: Array<number>, zoomed = false): void {
  //   // our two js canvas to draw on
  //
  //   const width = this.widthDiv / normalizedData.length;
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
  //
  //   this.interval = new Interval({width: this.widthDiv}, false, this.convSecToPix(this.intervalSeconds));
  //   this.intervalzoomer = new Interval({width: this.widthDiv}, true, this.convSecToPix(this.audioLengthInSec*this.zoomdistance))
  //   if(zoomed){
  //     this.groupWave.add(this.interval!.vertLine)
  //     this.groupWave.add(this.interval!.leftLine)
  //     this.groupWave.add(this.interval!.rightLine)
  //   }
  //   else{
  //     this.groupWave.add(this.intervalzoomer!.vertLine)
  //     this.groupWave.add(this.intervalzoomer!.leftLine)
  //     this.groupWave.add(this.intervalzoomer!.rightLine)
  //   }
  //
  //   //add the linegroup to the scene
  //
  //   this.twoCanvas.add(this.groupWave);
  //   //this.addZUI()
  //   this.twoCanvas.update()
  // }
  //
  //
  //
  // convSecToPix(sec: number) {
  //   return sec  * this.widthDiv/ this.currentLength
  // }
  //
  // convPixToSec(pixX: number, dataLenght = this.currentTruncation.length){
  //   return this.convPixToDataPoint(pixX, dataLenght)/(this.samplesPerSecond??0);
  // }
  //
  // convPixToDataPoint(pixX: number, dataLength = this.normalizedData.length) {
  //   return pixX / this.widthDiv * dataLength
  // }
  //
  // convDataPointToPix(dataPoint: number, dataLength = this.normalizedData.length) {
  //   return dataPoint / dataLength * this.widthDiv
  // }


}

