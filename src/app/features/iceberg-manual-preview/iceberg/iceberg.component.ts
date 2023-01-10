import {AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {EisbergService} from "../../../services/vis-services/eisberg.service";
import Two from "two.js";
import {Color} from "../../../entity/Color";
import {Polygon} from "two.js/src/shapes/polygon";
import {IcebergParams} from "../../../entity/Icebergparams";
import {IceBergConfig} from "../../../entity/IceBergConfig";

@Component({
  selector: 'app-iceberg',
  templateUrl: './iceberg.component.html',
  styleUrls: ['./iceberg.component.scss']
})
export class IcebergComponent implements OnInit, AfterViewInit, OnChanges {

  @ViewChild('test') myDiv?: ElementRef;

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


  constructor(private es: EisbergService) {

  }


  ngOnChanges(changes: SimpleChanges): void{
    if (changes['iceConfig'] !== undefined) {
      this.updateIceberg(changes['iceConfig'].currentValue.params)
    }
  }


  ngAfterViewInit(): void{
    var params = {
      fitted: true
    };
    //var elem = document.body;
    var elem = this.myDiv?.nativeElement;
    this.twoCanvas = new Two(params).appendTo(elem);

    this.drawIceberg();
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
    var y = 240

    var test = new Two.Polygon(300, 240+99, 10, 2)

    let color1 = new Color("#00FFBB")
    let color2 = new Color("#AA00FF")
    this.eisberg = this.es.generateEisberg(radius, x, y, this.iceConfig);
    this.twoCanvas.add(this.eisberg);
    this.twoCanvas.add(test)


// Don’t forget to tell two to draw everything to the screen
    this.twoCanvas.update();
  }

  updateIceberg(params: IcebergParams): void{
    this.es.updateIceberg(this.eisberg, params)
    this.twoCanvas.update();
  }

  ngOnInit(): void {
  }

}
