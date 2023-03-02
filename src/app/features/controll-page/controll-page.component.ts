import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, ChangeDetectorRef} from '@angular/core';
import {IcebergParams} from "../../entity/Icebergparams";
import {IceBergConfig} from "../../entity/IceBergConfig";
import {Polygon} from "two.js/src/shapes/polygon";
import TWEEN from "@tweenjs/tween.js";
import {EisbergService} from "../../services/vis-services/eisberg.service";
import {ModelOutputs} from "../../entity/ModelOutput";
import Two from "two.js";
import {CCCOutputToMorph} from "../../shared/components/canvasjs-cancer/canvasjs-cancer.component";
import {BackendService} from "../../services/backend-service/backend.service";
import {MorphService} from "../../services/vis-services/morph.service";
import {Group} from "two.js/src/group";
import {Observable, Observer, Subject} from "rxjs";

export interface DurationsInMs{
  oneIcebergDuration:number;
  animDuration:number;
  delayDuration:number;
}

@Component({
  selector: 'app-controll-page',
  templateUrl: './controll-page.component.html',
  styleUrls: ['./controll-page.component.scss']
})

export class ControllPage implements OnInit {
  @ViewChild('iceberg') myDiv?: ElementRef;
  @Output() data: EventEmitter<any> = new EventEmitter<any>();

  modelOutputs: ModelOutputs = {
    sampleRate: 44100,
    durationInSec: 201.3,
    outputCount: 200,
    modelOutputs: [],
  }

  //output from ccc
  cccOutputToMorph : CCCOutputToMorph = {
    start: false,
    restart:false,
    selected: false,
    currentSec: 0,
    audioBuffered: false,
    selectedIceParams: undefined,
    outputs: undefined
  }

  //anim durations calculate from modeloutputs and outputcount
  durationsInMs : DurationsInMs={
    oneIcebergDuration : this.modelOutputs.durationInSec/this.modelOutputs.outputCount*1000,
    animDuration: this.modelOutputs.durationInSec/this.modelOutputs.outputCount*1000*0.2,
    delayDuration: this.modelOutputs.durationInSec/this.modelOutputs.outputCount*1000*0.8,
  }

  isLoadin = true;

  showIceberg = true;
  public showBarCharts = false;
  showSpiderCharts = false;

  //json array stuff and counter for where we are
  public jsonArray: any;


  morphInput: Subject<CCCOutputToMorph> = new Subject<CCCOutputToMorph>();



  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void{
    //this.twoCanvas = new Two(params).appendTo(elem)
  }

  addToObs($event: any){
    this.morphInput.next($event)
  }


  public setOutputsAndUpdate(cccOutputToMorph: CCCOutputToMorph){
    this.jsonArray = cccOutputToMorph.outputs!.modelOutputs
    let modelOutputs= cccOutputToMorph.outputs!
    this.durationsInMs = {
      oneIcebergDuration: this.modelOutputs.durationInSec / modelOutputs.outputCount * 1000,
      animDuration: modelOutputs.durationInSec / modelOutputs.outputCount * 1000 * 0.2,
      delayDuration: modelOutputs.durationInSec / modelOutputs.outputCount * 1000 * 0.8,
    }
    this.data.emit(this.jsonArray)
    this.isLoadin=false
  }

  public isLoadingBackend($event: boolean){
    this.isLoadin=$event
  }
}
