import {
  ChangeDetectionStrategy,
  Component, ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {EisbergService} from "../../services/vis-services/eisberg.service";
import Two from "two.js";
import {IcebergParams} from "../../entity/Icebergparams";
import {IceBergConfig} from "../../entity/IceBergConfig";
import {Color} from "../../entity/Color";
import {Vector} from "two.js/src/vector";
import {ColorService} from "../../services/vis-services/color.service";
import {LinearGradient} from "two.js/src/effects/linear-gradient";
import {TimeUtilsService} from "../../services/data-service/time-utils.service";

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

  constructor(private es: EisbergService, private cs: ColorService, private tus: TimeUtilsService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit():void {
  }

  ngOnChanges(changes:SimpleChanges): void{
    if(!changes['jsonArray'].firstChange){
      this.onLoadedData(changes['jsonArray'].currentValue, this.icebergDuration);
    }
  }

  onLoadedData(jsonArray: any, icebergDuration: number){

    const singleWidth= this.width/jsonArray.length
    const elem = document.getElementById("iceberg-overview")

    var calcWidht = jsonArray.length *150 +380
    elem!.style.width = calcWidht+"px";

    var params = {fitted:true}
    var elemIn = this.myDiv?.nativeElement;
    this.twoCanvas = new Two(params).appendTo(elemIn)

    let fillSave: any

    var iceConfs = this.es.genIceConfs(jsonArray)

    for(let i=0; i<iceConfs.length; i++){



      var ice= this.es.generateEisberg(200, 250+i*150, 240, iceConfs[i])
      ice.opacity=0.9

      this.icebergGroup.add(ice)

    }
    //refill the iceberg, because of width of div gets changed
    this.icebergGroup.children[8].fill = this.es.generateGradient(jsonArray[8].x4 ?? 0, this.cs.sampleColor(jsonArray[8].x2 ?? 0, new Color("#00FFBB"), new Color("#AA00FF")));
    this.genTimeLine(jsonArray.length, icebergDuration )
    this.twoCanvas.add(this.icebergGroup)
    this.twoCanvas.update()

  }

  genTimeLine(arrLength: number, oneIceBergDuration: number){
    var lastIcebergDuration = oneIceBergDuration*arrLength
    for(let i=0; i<arrLength; i++){
      var text= new Two.Text(this.tus.convSecToMinutesAndSec(i), 250+i*150, 360)
      text.fill="white"
      this.timelineGroup.add(text)
    }
   this.twoCanvas.add(this.timelineGroup)
  }
}
