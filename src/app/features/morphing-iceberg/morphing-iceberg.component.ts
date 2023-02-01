import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {IcebergParams} from "../../entity/Icebergparams";
import {IceBergConfig} from "../../entity/IceBergConfig";
import {Color} from "../../entity/Color";
import {Polygon} from "two.js/src/shapes/polygon";
import TWEEN from "@tweenjs/tween.js";
import {EisbergService} from "../../services/vis-services/eisberg.service";
import {ModelOutputs} from "../../entity/ModelOutput";
import Two from "two.js";
import {CCCOutputToMorph} from "../iceberg-manual-preview/canvasjs-cancer/canvasjs-cancer.component";
import {delay} from "rxjs";

@Component({
  selector: 'app-morphing-iceberg',
  templateUrl: './morphing-iceberg.component.html',
  styleUrls: ['./morphing-iceberg.component.scss']
})
export class MorphingIcebergComponent implements OnInit {
  @ViewChild('iceberg') myDiv?: ElementRef;

  @Input() modelOutputs: ModelOutputs = {
    sampleRate: 44100,
    durationInSec: 201.3,
    startInSec: 0,
    outputCount: 200,
    modelOutputs: [],
  }

  //output from ccc
  cccOutputToMorph : CCCOutputToMorph = {
    start: false,
    restart:false,
    selected: false,
    currentSec: 0
  }

  //anim durations calculate from modeloutputs and outputcount
  oneIcebergDurationInMs = this.modelOutputs.durationInSec/this.modelOutputs.outputCount*1000
  tweenAnimDurationInMs = this.oneIcebergDurationInMs*0.2;
  delayDurationInMs = this.oneIcebergDurationInMs*0.8;

  //two objects
  twoCanvas = new Two();
  eisberg = new Polygon();

  //json array stuff and counter for where we are
  public jsonArray: any;
  public counterJson = 0;

  //the tween animation as variable so we can stop it
  public t1 = new TWEEN.Tween(this.eisberg)

  constructor(private es: EisbergService, private httpClient: HttpClient) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void{
    var params = {fitted:true}
    var elem = this.myDiv?.nativeElement;
    this.twoCanvas = new Two(params).appendTo(elem)
    this.loadAssetsJson()
  }

  //load our debug json
  loadAssetsJson(){
    const resp =this.httpClient.get('./assets/modelOutputs.json').subscribe((response)=>{
      this.jsonArray = response
    });
  }

  morphNext(){
    //generate the iceconfs
    let iceConfs = this.genIceConfs()
    let iceConfigOld = iceConfs[0]
    let iceConfigNew = iceConfs[1]
    this.eisberg = this.es.generateEisberg(200, 300, 240, iceConfigOld)
    this.twoCanvas.add(this.eisberg)

    const iceNew = this.es.generateEisberg(200, 300, 240, iceConfigNew)

    this.morphIcebergToAnother(this.eisberg, iceNew, iceConfigOld.params, iceConfigNew.params)
  }

  //tween animation for morphing
  private morphIcebergToAnother(poly:Polygon,
                                poly2: Polygon,
                                params1: IcebergParams, params2: IcebergParams) {
    let thisObject = this;
    //what poly u want to animate then what properties
    this.t1 = new TWEEN.Tween(poly).to({skewX:poly2.skewX, height: poly2.height, position: poly2.position}, this.tweenAnimDurationInMs).easing(
      TWEEN.Easing.Quadratic.Out)
      //here comes the parameters we want to change/watch
      .onUpdate(function(poly: Polygon,elapsed:number){
        let currParams = thisObject.es.genStepComplexParams(params1, params2, elapsed)
        poly.fill = thisObject.es.getGradFromParams(currParams);
        poly.stroke = thisObject.es.getBorderFromParams(currParams);
        return poly;
      }).onComplete(()=>{
        poly.opacity=1
        this.eisberg.remove()
        this.morphNext()})
      .delay(this.delayDurationInMs-this.tweenAnimDurationInMs)
      .start()  //delay the animation
    //bind the update function so play gets called
    this.twoCanvas.bind('update', function (){
      TWEEN.update();
    }).play()
  }

  onPlayMorph($event: CCCOutputToMorph) {
    this.cccOutputToMorph = $event
    console.log(this.cccOutputToMorph)

    if(this.cccOutputToMorph.currentSec!=0){
      var delayAndIndex=this.calcCurrentIcebergIndex()
      this.t1.delay(delayAndIndex[0])
      this.counterJson = delayAndIndex[1]
    }
    if(this.cccOutputToMorph.start){
      this.twoCanvas.clear()
      this.t1.stop()
      this.morphNext()
    }else{
      if(this.cccOutputToMorph.restart){
        //restart so reset counter to 0 and stop
        this.t1.stop()
        this.counterJson = 0;
      }
      this.t1.stop()
    }
  }
  //generate the iceconfs and params from the jsons we got and pass them
  genIceConfs(){
    const iceBergParamsOld: IcebergParams = {
      skew: this.jsonArray[this.counterJson].x1,
      colorParam: this.jsonArray[this.counterJson].x2,
      height: this.jsonArray[this.counterJson].x3,
      frequency: this.jsonArray[this.counterJson].x4,
      borderParam: 1,
    };

    this.counterJson++;

    const iceBergParamsNew: IcebergParams = {
      skew: this.jsonArray[this.counterJson].x1,
      colorParam: this.jsonArray[this.counterJson].x2,
      height: this.jsonArray[this.counterJson].x3,
      frequency: this.jsonArray[this.counterJson].x4,
      borderParam: 1,
    };

    const iceConfigOld: IceBergConfig = {
      color1: new Color('blue'),
      color2: new Color('green'),
      params: iceBergParamsOld
    };

    const iceConfigNew: IceBergConfig = {
      color1: new Color('blue'),
      color2: new Color('green'),
      params: iceBergParamsNew
    };

    return [iceConfigOld, iceConfigNew]
  }

  //calulates the current index of our json TODO: the lefttime for delaying the tween needs to be calculated properly
  calcCurrentIcebergIndex(){
    var indexFloat =this.secToIceberg()
    var leftTimeNextIce = Math.ceil(indexFloat)-indexFloat
    return [leftTimeNextIce, Math.ceil(indexFloat)]
  }

  //calculate our current iceberg index as float
  secToIceberg(){
    return this.cccOutputToMorph.currentSec/this.modelOutputs.durationInSec*this.modelOutputs.outputCount
  }
}
