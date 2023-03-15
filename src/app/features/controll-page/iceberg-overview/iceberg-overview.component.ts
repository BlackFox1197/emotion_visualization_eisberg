import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component, ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {EisbergService} from "../../../services/vis-services/eisberg.service";
import Two from "two.js";
import {IcebergParams} from "../../../entity/Icebergparams";
import {IceBergConfig} from "../../../entity/IceBergConfig";
import {Color} from "../../../entity/Color";
import {Vector} from "two.js/src/vector";
import {ColorService} from "../../../services/vis-services/color.service";
import {LinearGradient} from "two.js/src/effects/linear-gradient";
import {TimeUtilsService} from "../../../services/data-service/time-utils.service";
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-iceberg-overview',
  templateUrl: './iceberg-overview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./iceberg-overview.component.scss']
})
export class IcebergOverviewComponent implements OnChanges {
  @ViewChild('icebergOverview') myDiv?: ElementRef;

  @Input('jsonArray') jsonArray: any
  @Input('icebergDuration') icebergDuration: number=0

  //two objects
  twoCanvas = new Two();
  icebergGroup = new Two.Group()
  timelineGroup = new Two.Group()
  width=1300

  constructor(private es: EisbergService, private cs: ColorService, private tus: TimeUtilsService, private changeDetector : ChangeDetectorRef) { }
  ngOnInit(): void {
  }
  ngAfterViewInit():void {
  }
  ngOnChanges(changes:SimpleChanges): void{
    if(!changes['jsonArray'].firstChange){
      this.onLoadedData(changes['jsonArray'].currentValue, this.icebergDuration);
      console.log("oninit"+this.icebergDuration)
    }
  }
  _showBarCharts = false;

  set showBarCharts(il: boolean) {
    this._showBarCharts = il;
    this.changeDetector.detectChanges();
  }


  onLoadedData(jsonArray: any, icebergDuration: number){

    var calcWidth = jsonArray.length *250 +380
    const elem = document.getElementById("iceberg-overview")
    elem!.style.width = calcWidth+"px";

    while (elem!.firstChild) {
      elem!.removeChild(elem!.lastChild!);
    }

    var params = {fitted:true}
    var elemIn = this.myDiv?.nativeElement;
    this.twoCanvas = new Two(params).appendTo(elemIn)

    this.removePreviousStuff()

    var iceConfs = this.es.genIceConfs(jsonArray)

    for(let i=0; i<iceConfs.length; i++){
      var ice= this.es.generateEisberg(200, 250+i*250, 240, iceConfs[i])
      ice.opacity=0.9

      this.icebergGroup.add(ice)
    }
    //refill the iceberg, because of width of div gets changed
    /*if(jsonArray.length>8){
      this.icebergGroup.children[8].fill = this.es.generateGradient(jsonArray[8].x4 ?? 0, this.cs.sampleColor(jsonArray[8].x2 ?? 0, this.es.color1, this.es.color2));
    }

     */
    this.genTimeLine(jsonArray.length, icebergDuration )
    this.twoCanvas.add(this.icebergGroup)
    this.twoCanvas.update()
  }

  genTimeLine(arrLength: number, oneIceBergDuration: number){
    this.timelineGroup = new Two.Group()
    var lastIcebergDurationInSec = Math.ceil(oneIceBergDuration*arrLength/1000)
    for(let i=0; i<lastIcebergDurationInSec; i++) {
      var shift = oneIceBergDuration/1000
      var text= new Two.Text(this.tus.convSecToMinutesAndSec(i), 80+i*(250/shift), 360)
      text.fill="white"
      this.timelineGroup.add(text)
    }
   this.twoCanvas.add(this.timelineGroup)
  }

  removePreviousStuff(){
    this.twoCanvas.remove(this.icebergGroup)
    this.twoCanvas.remove(this.timelineGroup)
    this.twoCanvas.clear()
    this.icebergGroup = new Two.Group()
    this.timelineGroup = new Two.Group()
  }
//----------------------------------------------------------Bar Chart------------------------------------------------------------------------------------------------------
  public barChartLegend = false;
  public barChartPlugins = [];


  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: false,
    borderColor: "white",
    scales:{
      y:{
        min: -1,
        max: 1,
      }
    }
  };

  public radarChartOptions: ChartConfiguration<'radar'>['options'] = {
    responsive: false,
    borderColor: "white",
  };

}
