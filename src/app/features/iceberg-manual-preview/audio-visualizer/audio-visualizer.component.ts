import {Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import * as events from "events";
import {HttpClient} from "@angular/common/http";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {IcebergComponent} from "../iceberg/iceberg.component";
import Two from "two.js";

@Component({
  selector: 'app-audio-visualizer',
  templateUrl: './audio-visualizer.component.html',
  styleUrls: ['./audio-visualizer.component.scss']
})


export class AudioVisualizerComponent implements OnInit {


  @ViewChild('audioWavTest') myDiv?: ElementRef;
  @ViewChild('specTest') specDiv?: ElementRef;

  buttonStatus = "pause"

  private chart: any;
  private margin= 100;
  private scaleFactor= 10;

  twoCanvas = new Two();

  @Output() updateFile: EventEmitter<Event> = new EventEmitter<Event>();

  constructor(private sanitize: DomSanitizer) {}


  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void{
    if(changes['file']!==undefined){
      this.onFileSelected(changes['file'].currentValue)
    }
  }

  evToFile(event: any): Event{
    //var array = this.onFileSelected(event);
    //this.fileName = event.target.value
    const file:File = event.target.files[0];
    //const fileURL = this.getUrlFromUpload(file)
    this.loadFileSound(file);


    return event;
  }
  getUrlFromUpload(audio: any): SafeUrl{
    return this.sanitize.bypassSecurityTrustUrl(URL.createObjectURL(audio));
  }

  async loadFileSound(file: File) {
    const fileURL = URL.createObjectURL(file);
    const response = await fetch(fileURL)
    var x =this.onFileSelected(await response.arrayBuffer())
  }

  async onFileSelected(buffer: ArrayBuffer): Promise<Array<any>> {
    let chunkSize = 200,
      scaleFactor = (150 - this.margin * 2) / 2;
    let audioContext = new AudioContext(),
      audioBuffer = await audioContext.decodeAudioData(buffer),
      float32Array = audioBuffer.getChannelData(0);
    let array = [],
      i = 0,
      length = float32Array.length;
    while (i < length) {
      array.push(float32Array.slice(i, i += chunkSize).reduce(function (total, value) {
        return Math.max(total, Math.abs(value));
      }));
    }
    console.log(array)
    var params = {
      fitted: true
    };
    //var elem = document.body;
    var elem = this.myDiv?.nativeElement;
    this.twoCanvas = new Two(params).appendTo(elem);
    this.drawAudioWave(array)

    return array
  }
  //
  // togglePlaying = (event: any, audioContext: AudioContext) => {
  //   if(audioContext.state === 'running') {
  //     audioContext.suspend().then(() => {
  //       this.buttonStatus = "Play";
  //     });
  //   }
  //   else if(audioContext.state === 'suspended') {
  //     audioContext.resume().then(() => {
  //       this.buttonStatus = "Pause";
  //     });
  //   }
  // }
  //
  // stopPlaying = (source: any) => {
  //   source.stop();
  // }

  drawAudioWave(array: Array<number>):void{
    var curvePointsArray = []
    for(var i=0; i<array.length;i++){
      curvePointsArray.push(new Two.Anchor(i, array[i]))
    }

    var curve = this.twoCanvas.makeCurve(curvePointsArray);
    curve.linewidth =0.1;
    curve.scale = 10;
    this.twoCanvas.add(curve);
    this.twoCanvas.update()
  }


  genDataPoints(array: any){
    let dps = []
    for (let index in array) {
      dps.push({ x: this.margin + Number(index), y: [50 - array[index] * this.scaleFactor, 50 + array[index] * this.scaleFactor]});
    }

    //this.chart.options.data[0].dataPoints = dps;
    //this.chart.render();
  }
}
