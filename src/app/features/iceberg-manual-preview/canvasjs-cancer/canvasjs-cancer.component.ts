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
  audioSrc = '';


  playState = new PLayState();


  constructor(private audiService: AudioService, public  waveFormService: WaveFormService) {
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



  /** This function plays the current selection
   * it checks first, whether a small segment is selected,
   * then if there is zoom and if neither is true assumes that the whole sound
   * file has to be played
   *
   */
  play(){
    let playedSecs = this.playState.playedUnits/this.playState.unitsPerSeconds
    if(this.waveFormService.selected){
      let startEnd = this.waveFormService.selectedInterval;
      this.audiService.playSelection(this.audioBuffer!, startEnd!.start + playedSecs, startEnd!.end - (startEnd!.start + playedSecs))
    }
    else{
      if(this.waveFormService.zoomed){
        let start = this.waveFormService.currentZoomedOffsetInSec;
        let end = this.waveFormService.currentZoomedOffsetInSec + (this.zoomdistance * this.waveFormService.originalData.length /this.waveFormService.samplesPerSecond)
        this.audiService.playSelection(this.audioBuffer!, start + playedSecs, end - (start + playedSecs))
      }
      else{
       this.audiService.playSelection(this.audioBuffer!, playedSecs, undefined)
      }
    }
    this.playSelect();

  }


  /**
   * this stops the sound if there is some running
   */
  stop(){
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
  playSelect(){
    if(this.playState.intervallId??0 != 0){
      this.clearAndResetPlayed(this.playState.intervallId)
    }
    // this is the main loop for the animation of the audioGraph
    this.playState.intervallId = setInterval( ()=>{
      // update the played units
      this.playState.playedUnits++;
      // redraw the graph
      this.waveFormService.timePlayed(this.playState.playedUnits, this.playState.unitsPerSeconds);
      this.twoCanvas.update()
      // the interval is calculated by the units per seconds, this calculates the milliseconds
    }, 1000/this.playState.unitsPerSeconds)

    // needed to end local loop and not the next loop or any other
    let localId = this.playState.intervallId;

    // is thrown when the audioSource ends, it is stopped or paused ('cause internally that's a stop)
    this.audiService.source!.addEventListener("ended", event => {
      clearInterval(localId);
      if(!this.playState.paused){
        // reset the played units
        this.playState.playedUnits = 0;
        //reset the graph
        this.waveFormService.resetPlayed(this.twoCanvas);
        // reset to false, in case next time its a pause
      }else {
        // the paused state is reset, as it should be a one time reset protection only
        // if not reset, the graph will stay colored
        this.playState.paused = false;
      }
    })
  }

  pauseSelect(){
    //just to be sure we do not reset the graph
    this.playState.paused = true;
    this.audiService.stopSource()

  }


  clearAndResetPlayed(intervallId?: NodeJS.Timer){
    clearInterval(intervallId)
    this.waveFormService.resetPlayed(this.twoCanvas);
    this.playState.playedUnits = 0;
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
