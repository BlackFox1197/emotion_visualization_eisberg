import {
  AfterViewInit, ChangeDetectorRef,
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
import {IcebergComponent} from "../../../features/iceberg-manual-preview/iceberg/iceberg.component";
import {IcebergParams} from "../../../entity/Icebergparams";
import {TimeUtilsService} from "../../../services/data-service/time-utils.service";
import {MatSliderChange} from "@angular/material/slider";
import {BackendService} from "../../../services/backend-service/backend.service";
import {Routes} from "../../../services/routes";

export interface CCCOutputToMorph {
  start: boolean;
  restart: boolean;
  selected: boolean;
  currentSec: number
  audioBuffered: boolean;
  selectedIceParams: ModelOutput|undefined;
  outputs: ModelOutputs|undefined;
}

export interface DurationInSec{
  value: number,
  viewValue: string,
}

@Component({
  selector: 'app-canvasjs-cancer',
  templateUrl: './canvasjs-cancer.component.html',
  styleUrls: ['./canvasjs-cancer.component.scss'],
})

export class CanvasjsCancerComponent implements OnInit, AfterViewInit {

  durations: DurationInSec[]=[{value: 0.2, viewValue:"200ms"},
    {value: 1, viewValue:"1sec"},
    {value: 3.5, viewValue:"3.5sec"},
    {value: 5, viewValue:"5sec"},]

  selectedDuration = this.durations[2].value

  @Output() durationSelected: EventEmitter<number> = new EventEmitter<number>();
  @Output() playMorph: EventEmitter<CCCOutputToMorph> = new EventEmitter<CCCOutputToMorph>();
  @Output() backendLoading: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() segmentLoading: EventEmitter<boolean> = new EventEmitter<boolean>();

  cccOutputToMorph: CCCOutputToMorph={
    start: false,
    restart: false,
    selected: false,
    currentSec: 0,
    audioBuffered: false,
    selectedIceParams: undefined,
    outputs: undefined,
  }

  twoCanvas = new Two();
  twoSpec = new Two();

  //the percentage zoomed by the zoomer intervall
  zoomdistance = 0.5;

  @ViewChild('wavTwoJs', { static: false }) myDiv?: ElementRef;
  @ViewChild('specTest') specDiv?: ElementRef;

  sampleCount = 3000;
  audioBuffer?: AudioBuffer;
  sec= "0";
  audioLengthInSec="0";

  normalizedData: Array<number> = [];
  normalizedDataZoomed: Array<number> = [];
  audioSrc = '';
  fileName = 'test.mp3';


  _isLoading = false;
  _isLoadingBackend = false;
  _isLoadingSegment = false;

  set isLoading(il: boolean) {
    this._isLoading = il;
    this.changeDetector.detectChanges();
  }

  set ilBackend(il: boolean) {
    this._isLoadingBackend = il;
    this.backendLoading.emit(il);
  }


  set loadSegment(load: boolean){
    this._isLoadingSegment = load;
    this.segmentLoading.emit(load);
  }

  playState = new PLayState();
  playButotnsState = new PlayButtonsState()

  constructor(private audiService: AudioService, public  waveFormService: WaveFormService, public spectroService: SpectroService,
              public tus: TimeUtilsService, private changeDetector : ChangeDetectorRef, public backend: BackendService) {
  }

  ngOnInit() {
    this.audioDrawer('/assets/test.mp3')
  }

  //change for the duration picker
  onChange(value: any) {
    this.waveFormService.redraw(value, this.twoCanvas)
  }


  fileToFile(file: any){
    const fileURL = URL.createObjectURL(file);
    this.audioDrawer(fileURL)
    this.fileName=file.name;
    this.ilBackend = true;
    // this.backend.uploadAudioFile("http://192.168.3.18:8001/icebergs/upload", "yee", false, file).subscribe(
    this.backend.uploadAudioFile(Routes.baseRoute + "/icebergs/upload", "yee", false, file).subscribe(
      (next) => {
        var arr = next;
        var outputs : any=[];
        this.ilBackend = false;
        for(let i=0; i<arr.length;i++){
          let modelOutput=new ModelOutput(arr[i]["fields"])
          outputs.push(modelOutput)
          let modelOutputs : ModelOutputs = {
            sampleRate: 16000,
            durationInSec: this.audioBuffer?.duration!,
            outputCount: outputs.length,
            modelOutputs: outputs,
          }

          this.setCCCParamsAndEmit(undefined, undefined, undefined, undefined, undefined, modelOutputs)

        }
      }
    )

    return file;
  }

  async evToFile(event: any) {
    const file: File = event.target.files[0];
    return this.fileToFile(file);
  }

  /**
   * generates normalized data with [AudioService] and draws initial waveform
   * @param file
   */
  audioDrawer(file: string): void {
    this.isLoading = true
    this.audioSrc = file;
    this.audiService.getAudioBufferFromFile(file).then(
      buffer => {
        this.audioBuffer = buffer;
        this.audioLengthInSec = this.tus.convSecToMinutesAndSec( buffer.duration.toFixed(1))

        this.setCCCParamsAndEmit(undefined,undefined, undefined, undefined)

        this.normalizedData =this.audiService.generateDataPoints(buffer, this.sampleCount);


        this.isLoading = false
        this.initTwoJs()

        let audioLengthInSec = this.audiService.calculateAudioLenght(buffer);
        let samplesPerSecond = this.sampleCount / audioLengthInSec;
        this.waveFormService.init(samplesPerSecond, this.normalizedData, this.zoomdistance);
        this.waveFormService.drawTwoJs(this.normalizedData, false, this.twoCanvas);
      }
    );

  }

  ngAfterViewInit() {
  }

  initTwoJs(){
    var params = {
      fitted: true,
      type: Two.Types.canvas
    };
    var elem = this.myDiv?.nativeElement;
    //var spec = this.specDiv?.nativeElement
    this.twoCanvas = new Two(params).appendTo(elem);
    //this.twoSpec = new Two(params).appendTo(spec)
  }

  mouseover(event: any) {
    this.waveFormService.moveIntervall(event.x, this.twoCanvas);
  }

  @HostListener('document:keydown.escape', ['$event']) unzoom(event: KeyboardEvent) {
    this.setCCCParamsAndEmit(false, false, false, 0, undefined)
    this.stop();
    this.waveFormService.resetZoom(this.twoCanvas);
  }



  click(event: any) {
    this.stop();
    this.waveFormService.click(event, this.twoCanvas)
      if(this.waveFormService.selectedInterval != undefined){
       this.loadSegment = true;
       this.backend.getModelOutputForSelected(this.waveFormService.selectedInterval.start, this.waveFormService.selectedInterval.end, this.selectedDuration, this.fileName).subscribe(
          (next) => {
            this.loadSegment = false;
            this.cccOutputToMorph.selectedIceParams = new ModelOutput(next['fields'])
            this.setCCCParamsAndEmit(true, undefined, true, this.waveFormService.selectedInterval!.start)
            this.audiService.playSelection(this.audioBuffer!, this.waveFormService.selectedInterval!.start, this.waveFormService.selectedInterval!.end-this.waveFormService.selectedInterval!.start);
            this.playSelect();
            this.sec = this.tus.convSecToMinutesAndSec(this.waveFormService.selectedInterval!.start.toFixed(1))
          }
        )


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
      this.playButotnsState.play();
      let playedSecs = this.playState.playedUnits/this.playState.unitsPerSeconds
      if(this.waveFormService.selected){
        let startEnd = this.waveFormService.selectedInterval;
        this.setCCCParamsAndEmit(true, true, true, startEnd!.start+playedSecs)
        this.audiService.playSelection(this.audioBuffer!, startEnd!.start + playedSecs, startEnd!.end - (startEnd!.start + playedSecs))
      }
      else{
        if(this.waveFormService.zoomed){
          this.setCCCParamsAndEmit(true, true, undefined, this.waveFormService.currentZoomedOffsetInSec+playedSecs)
          let start = this.waveFormService.currentZoomedOffsetInSec;
          let end = this.waveFormService.currentZoomedOffsetInSec + (this.zoomdistance * this.waveFormService.originalData.length /this.waveFormService.samplesPerSecond)
          this.audiService.playSelection(this.audioBuffer!, start + playedSecs, end - (start + playedSecs))
        }
        else{
          this.audiService.playSelection(this.audioBuffer!, playedSecs, undefined)
          this.setCCCParamsAndEmit(true, undefined, undefined, playedSecs)
        }
      }
      this.playSelect();
    }

  }

  /**
   * this stops the sound if there is some running
   */
  stop(){
    this.playButotnsState.stop();
    this.setCCCParamsAndEmit(false,true, undefined, 0, undefined)
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

    this.playButotnsState.play();
    if(this.audioBuffer!=undefined){
      if(this.playState.intervallId??0 != 0){
        this.clearAndResetPlayed(this.playState.intervallId)
      }
      // this is the main loop for the animation of the audioGraph
      this.playState.intervallId = setInterval( ()=>{
        //set sec
        this.sec = this.tus.convSecToMinutesAndSec(((this.waveFormService.selectedInterval?.start??0) +(this.playState.playedUnits/this.playState.unitsPerSeconds)).toFixed(1))

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
          this.playButotnsState.stop()
          this.setCCCParamsAndEmit(false, true, undefined, 0, undefined)
          // reset the played units
          this.playState.playedUnits = 0;
          //reset the graph
          this.waveFormService.resetPlayed(this.twoCanvas);
          // reset to false, in case next time it's a pause
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
    this.playButotnsState.pause();
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

  // #########################################################################################
  // ############################################ Changes ###########################
  // #########################################################################################

  //emit changes to our morphing iceberg component
  setCCCParamsAndEmit(start?:boolean, restart?:boolean, selected?:boolean, currentSec?: number, selectedIceParams?: ModelOutput, outputs?: ModelOutputs){
    this.cccOutputToMorph.start=start??this.cccOutputToMorph.start;
    this.cccOutputToMorph.restart=restart??this.cccOutputToMorph.restart;
    this.cccOutputToMorph.selected=selected??this.cccOutputToMorph.selected;
    this.cccOutputToMorph.currentSec=currentSec??this.cccOutputToMorph.currentSec;
    this.cccOutputToMorph.audioBuffered= (this.audioBuffer!=undefined)
    this.cccOutputToMorph.selectedIceParams = selectedIceParams?? this.cccOutputToMorph.selectedIceParams
    this.cccOutputToMorph.outputs = outputs ?? this.cccOutputToMorph.outputs
    this.sec =  this.tus.convSecToMinutesAndSec( currentSec?.toFixed(1)??this.sec);
    this.playMorph.emit(this.cccOutputToMorph)
  }

  //change bool for selecting without zoom and, regen intervalls/draw intervall and remove intervallzoomer
  setSelectWOZoom(checked: boolean){
    this.stop()
    this.waveFormService.selectWOZoom=checked
    if(this.waveFormService.zoomed){
      this.waveFormService.resetZoom(this.twoCanvas);
    }
    if(!checked){
      this.waveFormService.regenerateIntervals()
    }
    this.waveFormService.drawWOZoom(this.twoCanvas)
  }

  //set our zoomval from slider, gets redrawn with mouseover function
  setZoomVal(value: MatSliderChange) {
    this.zoomdistance=value.value??0.5
    this.waveFormService.zoomPercentage=this.zoomdistance
    this.waveFormService.redraw(this.selectedDuration, this.twoCanvas)
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


class PlayButtonsState{
  playing = false;
  paused = false;


  play(){
    this.playing = true;
    this.paused = false;
  }

  pause(){
    this.paused = true;
    this.playing = false;
  }

  stop(){
    this.paused = false;
    this.playing = false;
  }
}
