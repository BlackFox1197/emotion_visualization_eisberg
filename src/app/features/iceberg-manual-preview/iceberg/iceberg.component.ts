import {AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {EisbergService} from "../../../services/vis-services/eisberg.service";
import Two from "two.js";
import {Color} from "../../../entity/Color";
import {Polygon} from "two.js/src/shapes/polygon";
import {IcebergParams} from "../../../entity/Icebergparams";
import {IceBergConfig} from "../../../entity/IceBergConfig";
import {Vector} from "two.js/src/vector";
import {Tween} from "@tweenjs/tween.js";
import {HttpClient} from "@angular/common/http";
import {ModelOutput} from "../../../entity/ModelOutput";
import {Curve} from "two.js/src/utils/curves";
import {delay} from "rxjs";

const TWEEN = require('@tweenjs/tween.js')

@Component({
  selector: 'app-iceberg',
  templateUrl: './iceberg.component.html',
  styleUrls: ['./iceberg.component.scss']
})
export class IcebergComponent implements OnInit, AfterViewInit, OnChanges {

  @ViewChild('test') myDiv?: ElementRef;

  public jsonArray: any;
  public counterJson = 0;

  @Input() iceConfig: IceBergConfig = {
    color1: new Color('blue'),
    color2: new Color('green'),
    params: {
      skew: 0,
      frequency: 0,
      colorParam: 0,
      borderParam: 0,
      height: 0,
    }
  };

  twoCanvas = new Two();
  eisberg = new Polygon();

  params: IcebergParams = {skew: 0}


  constructor(private es: EisbergService, private httpClient: HttpClient) {
  }

  ngOnChanges(changes: SimpleChanges): void{
    if (changes['iceConfig'] !== undefined) {
      this.updateIceberg(changes['iceConfig'].currentValue.params)
    }
  }

  ngAfterViewInit(): void{
    this.loadAssetsJson()
    var params = {
      fitted: true
    };
    //var elem = document.body;
    var elem = this.myDiv?.nativeElement;
    this.twoCanvas = new Two(params).appendTo(elem);

    this.drawIceberg();
    /*
    const iceBergParams: IcebergParams = {
      skew: 1,
      colorParam: -1,
      borderParam: -1,
      height: 0.8,
      frequency: 1,
    };

    const iceConfig: IceBergConfig = {
      color1: new Color('blue'),
      color2: new Color('green'),
      params: iceBergParams
    };
    const ice2 = this.es.generateEisberg(200, 300, 240, iceConfig)
    ice2.opacity=0


    this.morphIcebergToAnother(this.eisberg, ice2, this.iceConfig.params, iceBergParams);

     */
  }

  updateSkew(event: any): void{
    this.updateIceberg({skew: event.target.value as number});
  }

  drawIceberg(a = -0.6, b = 0.999999): void{
    // var params = {
    //   fullscreen: false
    // };
    // //var elem = document.body;
    // var elem = this.myDiv?.nativeElement;
    // var two = new Two(params).appendTo(elem);
    //untere ecken (x,y) + r *2,0944

    var radius = 200;
    var x = 300;
    var y = 240;



    let color1 = new Color("#00FFBB")
    let color2 = new Color("#AA00FF")
    this.eisberg = this.es.generateEisberg(radius, x, y, this.iceConfig);
    this.twoCanvas.add(this.eisberg);


// Don’t forget to tell two to draw everything to the screen
    this.twoCanvas.update();
  }

  updateIceberg(params: IcebergParams): void{
    this.es.updateIceberg(this.eisberg, params)
    this.twoCanvas.update();
  }

  ngOnInit(): void {
  }

  loadAssetsJson(){
    const resp =this.httpClient.get('./assets/modelOutputs.json').subscribe((response)=>{
      this.jsonArray = response
      // this.loopJsons(this.jsonArray)
      console.log(this.jsonArray)
      this.morphNext();
    });
  }

  // private loopJsons(jsonArray: Array<any>){
  //   for(let i=0; i<jsonArray.length;i++){
  //     const iceBergParams: IcebergParams = {
  //       skew: jsonArray[i].x1,
  //       colorParam: jsonArray[i].x2,
  //       borderParam: 1,
  //       height: jsonArray[i].x3,
  //       frequency: jsonArray[i].x4,
  //     };
  //
  //     const iceConfig: IceBergConfig = {
  //       color1: new Color('blue'),
  //       color2: new Color('green'),
  //       params: iceBergParams
  //     };
  //     const ice2 = this.es.generateEisberg(200, 300, 240, iceConfig)
  //     ice2.opacity=0
  //     this.morphIcebergToAnother(this.eisberg, ice2, this.iceConfig.params, iceBergParams);
  //
  //     this.eisberg= ice2
  //   }
  // }

  morphNext(){
    const iceBergParamsOld: IcebergParams = {
      skew: this.jsonArray[this.counterJson].x1,
      colorParam: this.jsonArray[this.counterJson].x2,
      borderParam: 1,
      height: this.jsonArray[this.counterJson].x3,
      frequency: this.jsonArray[this.counterJson].x4,
    };

    this.counterJson++;

    const iceBergParamsNew: IcebergParams = {
      skew: this.jsonArray[this.counterJson].x1,
      colorParam: this.jsonArray[this.counterJson].x2,
      borderParam: 1,
      height: this.jsonArray[this.counterJson].x3,
      frequency: this.jsonArray[this.counterJson].x4,
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

    const ice1 = this.es.generateEisberg(200, 300, 240, iceConfigOld)
    this.morphIcebergToAnother(this.eisberg, ice1, iceBergParamsOld, iceBergParamsNew)

  }

  private morphIcebergToAnother(poly:Polygon,
                                poly2: Polygon,
                                params1: IcebergParams, params2: IcebergParams
  ) {

    let thisObject = this;
    //what poly u want to animate then what properties
    //this.twoCanvas.add(poly2)
    var t1 = new TWEEN.Tween(poly).to({skewX:poly2.skewX, height: poly2.height}, 500).easing(
      TWEEN.Easing.Quadratic.Out)
      //here comes the parameters we want to change/watch
      .onUpdate(function(poly: Polygon,elapsed:number){
        let currParams = thisObject.es.genStepComplexParams(params1, params2, elapsed)
        poly.fill = thisObject.es.getGradFromParams(currParams);
        poly.stroke = thisObject.es.getBorderFromParams(currParams);
        return poly;
    }).onComplete(()=>this.morphNext()).start()
    //Start the animation
    //
    // var t2 = new TWEEN.Tween(poly2).to({opacity:1}, 1000).easing(
    //   TWEEN.Easing.Quadratic.Out).onUpdate(function (opacity: number, elapsed2: number){
    // })


    //bind the update function so play gets called
    this.twoCanvas.bind('update', function (){
      TWEEN.update();
    }).play()


        /*const iceBergParams: IcebergParams = {
          skew: Math.random(),
          colorParam: Math.random(),
          borderParam: 0,
          height: Math.random(),
          frequency: Math.random(),
        };
        this.updateIceberg(iceBergParams)

         */
    /*
    const iceBergParams: IcebergParams = {
      skew: 1,
      colorParam: 1,
      borderParam: 0,
      height: 1,
      frequency: 1,
    };
    this.updateIceberg(iceBergParams)

     */
  }
}
