import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import Two from 'two.js'
import {LinearGradient} from "two.js/src/effects/linear-gradient";
import {Stop} from "two.js/src/effects/stop";
import {EisbergService} from "./services/vis-services/eisberg.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit{
  title = 'ang-emo-vis';
  @ViewChild('test') myDiv?: ElementRef;


  constructor(private es: EisbergService) {
  }

  ngAfterViewInit(): void{
    this.drawCircle();
  }

  updateCircleA(event: any): void{
    this.drawCircle(event.target.value as number);
  }

  drawCircle(a = 0.1, b = 10): void{
    var params = {
      fullscreen: true
    };
    //var elem = document.body;
    var elem = this.myDiv?.nativeElement;
    var two = new Two(params).appendTo(elem);

    var radius = 500;
    var x = radius + 50;
    var y = radius + 50;
    let color1 = "00FF00"
    let color2 = "0000FF"
    two.add(this.es.generateEisberg(radius, x, y, b, 0 , a, color1, color2))

// Don’t forget to tell two to draw everything to the screen
    two.update();
  }

  ngOnInit(): void {
  }
}
