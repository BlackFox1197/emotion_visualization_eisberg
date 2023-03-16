import {Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {IceBergConfig} from "../../../entity/IceBergConfig";
import Two from "two.js";
import {EisbergService} from "../../../services/vis-services/eisberg.service";
import {coerceStringArray} from "@angular/cdk/coercion";
import {Color} from "../../../entity/Color";
import {ColorService} from "../../../services/vis-services/color.service";

@Component({
  selector: 'app-one-iceberg',
  templateUrl: './one-iceberg.component.html',
  styleUrls: ['./one-iceberg.component.scss']
})
export class OneIcebergComponent implements OnInit {
  @ViewChild('oneIcebergId') myDiv?: ElementRef;
  @Input() iceConf : IceBergConfig | undefined;
  @Input() emoName: string | undefined;


  twoCanvas= new Two({
      type: Two.Types.canvas,
  }
  );

  constructor(private es: EisbergService, private cs: ColorService) { }

  ngOnInit(): void {

  }

  ngAfterViewInit(){

    var params = {fitted:true}
    var elem = this.myDiv?.nativeElement;
    this.twoCanvas = new Two(params).appendTo(elem)
    this.drawIceberg()
  }

  drawIceberg(){
      let name = new Two.Text(this.emoName?.split(".")[0].split("_")[0], 250, 300)
    name.fill = "white"
      let eisberg= this.es.generateEisberg(200, 250, 240, this.iceConf!)
    //eisberg.fill = this.es.generateGradient(this.iceConf!.params.frequency ??0, this.cs.sampleColor(this.iceConf!.params.colorParam??0, new Color("#00FFBB"), new Color("#AA00FF")));

    this.twoCanvas.add(eisberg);
    this.twoCanvas.add(name);
    this.twoCanvas.update()
    console.log(eisberg)
  }
}
