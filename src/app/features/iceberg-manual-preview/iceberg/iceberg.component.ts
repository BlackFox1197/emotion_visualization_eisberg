import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {EisbergService} from "../../../services/vis-services/eisberg.service";
import Two from "two.js";
import {Color} from "../../../entity/Color";
import {Polygon} from "two.js/src/shapes/polygon";
import {IcebergParams} from "../../../entity/Icebergparams";

@Component({
  selector: 'app-iceberg',
  templateUrl: './iceberg.component.html',
  styleUrls: ['./iceberg.component.scss']
})
export class IcebergComponent implements OnInit, AfterViewInit {

  @ViewChild('test') myDiv?: ElementRef;

  twoCanvas = new Two();
  eisberg = new Polygon();

  params: IcebergParams = {skew: 0}


  constructor(private es: EisbergService) {

  }

  ngAfterViewInit(): void{
    var params = {
      fitted: true
    };
    //var elem = document.body;
    var elem = this.myDiv?.nativeElement;
    this.twoCanvas = new Two(params).appendTo(elem);

    this.drawCircle();
  }

  updateSkew(event: any): void{
    this.updateIceberg({skew: event.target.value as number});
  }

  drawCircle(a = -0.6, b = 0.999999): void{
    // var params = {
    //   fullscreen: false
    // };
    // //var elem = document.body;
    // var elem = this.myDiv?.nativeElement;
    // var two = new Two(params).appendTo(elem);

    var radius = 200;
    var x = radius + 50;
    var y = radius + 10;
    let color1 = new Color("#00FFBB")
    let color2 = new Color("#AA00FF")
    this.eisberg = this.es.generateEisberg(radius, x, y, b, -0.9 , a);
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

}
