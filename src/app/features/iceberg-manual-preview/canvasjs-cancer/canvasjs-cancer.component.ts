import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import Two from "two.js";
import {Line} from "two.js/src/shapes/line";
import {AudioService} from "../../../services/data-service/audio.service";
import {Interval} from "../../../entity/Interval";
import {WaveFormService} from "../../../services/vis-services/wave-form.service";
import {SpectroService} from "../../../services/vis-services/spectro.service";
import {ModelOutput, ModelOutputs, ModelOutputsInterface} from "../../../entity/ModelOutput";
import {EisbergService} from "../../../services/vis-services/eisberg.service";
import {IcebergComponent} from "../iceberg/iceberg.component";
import {IcebergParams} from "../../../entity/Icebergparams";

export interface CCCOutputToMorph {
  start: boolean;
  restart: boolean;
  selected: boolean;
  currentSec: number
  audioBuffered: boolean;
}

export interface DurationInSec{
  value: number,
  viewValue: string,
}

@Component({
  selector: 'app-canvasjs-cancer',
  templateUrl: './canvasjs-cancer.component.html',
  styleUrls: ['./canvasjs-cancer.component.scss']
})

export class CanvasjsCancerComponent implements OnInit, AfterViewInit {

  durations: DurationInSec[]=[{value: 0.03, viewValue:"30ms"},
    {value: 1, viewValue:"1sec"},
    {value: 3, viewValue:"3sec"},
    {value: 10, viewValue:"10sec"},]

  selectedDuration = this.durations[2].value

  @Output() durationSelected: EventEmitter<number> = new EventEmitter<number>();
  @Output() playMorph: EventEmitter<CCCOutputToMorph> = new EventEmitter<CCCOutputToMorph>();

  cccOutputToMorph: CCCOutputToMorph={
    start: false,
    restart: false,
    selected: false,
    currentSec: 0,
    audioBuffered: false,
  }

  twoCanvas = new Two();
  twoSpec = new Two();

  //the percentage zoomed by the zoomer intervall
  zoomdistance = 0.5;

  @ViewChild('wavTwoJs') myDiv?: ElementRef;
  @ViewChild('specTest') specDiv?: ElementRef;

  sampleCount = 3000;
  audioBuffer?: AudioBuffer;

  normalizedData: Array<number> = [];
  normalizedDataZoomed: Array<number> = [];
  audioSrc = '';

  playState = new PLayState();

  constructor(private audiService: AudioService, public  waveFormService: WaveFormService, public spectroService: SpectroService) {
  }

  ngOnInit() {
    this.audioDrawer('/assets/test.mp3')
  }

  onChange(value: any) {
    this.waveFormService.redraw(value, this.twoCanvas)
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
    /*
    const modelOutputArray: ModelOutput[] = [{x1: 0.5,x2: 0.3, x3: -0.1, x4: -1},
      {x1: 0.2,x2: 0.0, x3: 0.1, x4: -0.5},
      {x1: -0.5,x2: 0.1, x3: -0.3, x4: 1},
      {x1: 0.8,x2: -0.3, x3: -1, x4: 0.5}]
    const bar: ModelOutputsInterface = { sampleRate: 44100,
      durationInSec: 200,
      startInSec: 0,
      outputCount: 4,
      modelOutputs: modelOutputArray };
     */

    this.audioSrc = file;
    this.audiService.getAudioBufferFromFile(file).then(
      buffer => {
        this.audioBuffer = buffer;
        this.setCCCParamsAndEmit(undefined,undefined, undefined, undefined)
        console.log(this.cccOutputToMorph)
        this.normalizedData =this.audiService.generateDataPoints(buffer, this.sampleCount);
        let audioLengthInSec = this.audiService.calculateAudioLenght(buffer);
        let samplesPerSecond = this.sampleCount / audioLengthInSec;
        this.waveFormService.init(samplesPerSecond, this.normalizedData, this.zoomdistance);
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
    var spec = this.specDiv?.nativeElement
    this.twoCanvas = new Two(params).appendTo(elem);
    this.twoSpec = new Two(params).appendTo(spec)
  }

  mouseover(event: any) {
    this.waveFormService.moveIntervall(event.x, this.twoCanvas);
  }

  @HostListener('document:keydown.escape', ['$event']) unzoom(event: KeyboardEvent) {
    this.setCCCParamsAndEmit(false, false, false)
    this.stop();
    this.waveFormService.resetZoom(this.twoCanvas);
  }

  click(event: any) {
    this.stop();
    this.waveFormService.click(event, this.twoCanvas)
    if(this.waveFormService.selectedInterval != undefined){
      this.audiService.playSelection(this.audioBuffer!, this.waveFormService.selectedInterval.start, this.waveFormService.selectedInterval.end-this.waveFormService.selectedInterval.start);
      this.playSelect();
      this.setCCCParamsAndEmit(true, undefined, true, this.waveFormService.selectedInterval.start)
    }
  }

  /** This function plays the current selection
   * it checks first, whether a small segment is selected,
   * then if there is zoom and if neither is true assumes that the whole sound
   * file has to be played
   *
   */
  play(){
    if(this.audioBuffer!=undefined){
      let playedSecs = this.playState.playedUnits/this.playState.unitsPerSeconds
      if(this.waveFormService.selected){
        this.setCCCParamsAndEmit(true, true, true, this.playState.playedUnits/this.playState.unitsPerSeconds)
        let startEnd = this.waveFormService.selectedInterval;
        this.audiService.playSelection(this.audioBuffer!, startEnd!.start + playedSecs, startEnd!.end - (startEnd!.start + playedSecs))
      }
      else{
        if(this.waveFormService.zoomed){
          this.setCCCParamsAndEmit(true, true, undefined, this.playState.playedUnits/this.playState.unitsPerSeconds)
          let start = this.waveFormService.currentZoomedOffsetInSec;
          let end = this.waveFormService.currentZoomedOffsetInSec + (this.zoomdistance * this.waveFormService.originalData.length /this.waveFormService.samplesPerSecond)
          this.audiService.playSelection(this.audioBuffer!, start + playedSecs, end - (start + playedSecs))
        }
        else{

          this.audiService.playSelection(this.audioBuffer!, playedSecs, undefined)

        }
      }
      this.setCCCParamsAndEmit(true, true, undefined, this.playState.playedUnits/this.playState.unitsPerSeconds)
      this.playSelect();
    }

  }

  /**
   * this stops the sound if there is some running
   */
  stop(){
    this.setCCCParamsAndEmit(false,true)
    /** the stopped property is needed, because of the eventlistener that does listen on the ended event
    * but the ended event is also thrown when pausing!
    * but we do not need a reset every time
    */
    this.playState.paused = false;
    this.audiService.stopSource();

    // manually reset the graph and progress
    this.clearAndResetPlayed(this.playState.intervallId)
  }

  /**
   * as this code segment does not need anything specific from the caller it has been outsourced
   * to follow the dry principle
   */
  playSelect(){ // TODO: The vis of the audio seems to drift off a litte after time, that has to be fixed
    if(this.audioBuffer!=undefined){
      if(this.playState.intervallId??0 != 0){
        this.clearAndResetPlayed(this.playState.intervallId)}
      // this is the main loop for the animation of the audioGraph
      this.playState.intervallId = setInterval( ()=>{

        // update the played units
        this.playState.playedUnits++;
        // redraw the graph
        this.waveFormService.timePlayed(this.playState.playedUnits, this.playState.unitsPerSeconds);

        // spectrogram
        /*
        this.twoSpec.remove()
        this.twoSpec.update()
        let group = this.spectroService.drawSpec(this.audiService.getAnalyzerFrequ(), this.audiService.sampleRate!);
        this.twoSpec.add(group)
        this.twoSpec.update()

         */

        this.twoCanvas.update()

        // the interval is calculated by the units per seconds, this calculates the milliseconds
      }, 1000/this.playState.unitsPerSeconds)

      // needed to end local loop and not the next loop or any other
      let localId = this.playState.intervallId;

      // is thrown when the audioSource ends, it is stopped or paused ('cause internally that's a stop)
      this.audiService.source!.addEventListener("ended", event => {
        clearInterval(localId);
        if(!this.playState.paused){
          this.setCCCParamsAndEmit(false)
          // reset the played units
          this.playState.playedUnits = 0;
          //reset the graph
          this.waveFormService.resetPlayed(this.twoCanvas);
          // reset to false, in case next time its a pause
        }else {
          this.setCCCParamsAndEmit(false)
          // the paused state is reset, as it should be a one time reset protection only
          // if not reset, the graph will stay colored
          //TODO: commented this shit out because it resets our waveColoring
          //this.playState.paused = false;
        }
      })
    }

  }

  pauseSelect(){
    //just to be sure we do not reset the graph
    this.setCCCParamsAndEmit(false)
    this.playState.paused = true;
    this.audiService.stopSource()

  }


  clearAndResetPlayed(intervallId?: NodeJS.Timer){
    //TODO:also checked here
    if(!this.playState.paused){
      clearInterval(intervallId)
      this.waveFormService.resetPlayed(this.twoCanvas);
      this.playState.playedUnits = 0;
    }
  }

  setCCCParamsAndEmit(start?:boolean, restart?:boolean, selected?:boolean, currentSec?: number){
    this.cccOutputToMorph.start=start??this.cccOutputToMorph.start;
    this.cccOutputToMorph.restart=restart??this.cccOutputToMorph.restart;
    this.cccOutputToMorph.selected=selected??this.cccOutputToMorph.selected;
    this.cccOutputToMorph.currentSec=currentSec??this.cccOutputToMorph.currentSec;
    this.cccOutputToMorph.audioBuffered= (this.audioBuffer!=undefined)
    console.log(this.cccOutputToMorph)
    this.playMorph.emit(this.cccOutputToMorph)
  }
}


class PLayState{
  playedUnits = 0;
  unitsPerSeconds = 4;
  /** the paused property is needed, because of the eventlistener that does listen on the ended event
  * but the ended event is also thrown when pausing!
  * but we do not need a reset every time
  **/
  paused = false;
  intervallId?: NodeJS.Timer;
}
