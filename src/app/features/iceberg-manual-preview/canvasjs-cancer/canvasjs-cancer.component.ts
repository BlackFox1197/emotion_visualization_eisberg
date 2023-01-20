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




  twoCanvas = new Two();

  zoomdistance = 0.3;



  @ViewChild('wavTwoJs') myDiv?: ElementRef;

  sampleCount = 3000;
  audioBuffer?: AudioBuffer;

  normalizedData: Array<number> = [];
  normalizedDataZoomed: Array<number> = [];
  audioSrc = ''


  constructor(private audiService: AudioService, public  waveFormService: WaveFormService) {
  }


  ngOnInit() {
    this.audioDrawer('/assets/test.mp3')

  }

  /** This function plays the current selection
   * it checks first, whether a small segment is selected,
   * then if there is zoom and if neither is true assumes that the whole sound
   * file has to be played
   *
   */
  play(){
    if(this.waveFormService.selected){
      let startEnd = this.waveFormService.selectedInterval;
      this.audiService.playSelection(this.audioBuffer!, startEnd!.start, startEnd!.end - startEnd!.start)
    }
    else{
      if(this.waveFormService.zoomed){
        let start = this.waveFormService.currentZoomedOffsetInSec;
        let end = this.waveFormService.currentZoomedOffsetInSec + (this.zoomdistance * this.waveFormService.originalData.length /this.waveFormService.samplesPerSecond)
        this.audiService.playSelection(this.audioBuffer!, start, end - start)
      }
      else{
        this.audiService.playWhole(this.audioBuffer!)
      }
    }
   this.playSelect();

  }

  /**
   * this stops the sound if there is some running
   */
  stop(){
    this.audiService.stopSource();
  }

  async evToFile(event: any) {
    const file: File = event.target.files[0];
    const fileURL = URL.createObjectURL(file);
    this.audioDrawer(fileURL)

    return event;
  }

  /**
   * generates normalized data with [AudioService] and draws initial waveform
   * @param file
   */
  audioDrawer(file: string): void {
    this.audioSrc = file;
    this.audiService.getAudioBufferFromFile(file).then(
      buffer => {
        this.audioBuffer = buffer;
        this.normalizedData =this.audiService.generateDataPoints(buffer, this.sampleCount);
        let audioLengthInSec = this.audiService.calculateAudioLenght(buffer);
        let samplesPerSecond = this.sampleCount / audioLengthInSec;
        this.waveFormService.init(samplesPerSecond, this.normalizedData);
        this.waveFormService.drawTwoJs(this.normalizedData, false, this.twoCanvas);
      }
    );

  }


  ngAfterViewInit() {

    var params = {
      fitted: true,
      type: Two.Types.canvas
    };
    var elem = this.myDiv?.nativeElement;
    this.twoCanvas = new Two(params).appendTo(elem);



  }

  mouseover(event: any) {
    this.waveFormService.moveIntervall(event.x, this.twoCanvas);
  }

  @HostListener('document:keydown.escape', ['$event']) unzoom(event: KeyboardEvent) {
    this.stop();
    this.waveFormService.resetZoom(this.twoCanvas);
  }

  click(event: any) {
    this.stop();
    this.waveFormService.click(event, this.twoCanvas)
    if(this.waveFormService.selectedInterval != undefined){
      this.audiService.playSelection(this.audioBuffer!, this.waveFormService.selectedInterval.start, this.waveFormService.selectedInterval.end-this.waveFormService.selectedInterval.start);
      this.playSelect();
    }
  }


  /**
   * as this code segment does not need anything specific from the caller it has been outsourced
   * to follow the dry principle
   */
  playSelect(){
    let ms = 0;
    let id = setInterval( ()=>{
      ms++;
      this.waveFormService.timePlayed(ms);
      this.twoCanvas.update()
    }, 500)
    this.audiService.source!.addEventListener("ended", event => {
      clearInterval(id);
      this.waveFormService.resetPlayed(this.twoCanvas);
    })
  }



}

