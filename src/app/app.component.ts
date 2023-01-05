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


// Two.js has convenient methods to make shapes and insert them into the scene.
    var radius = 500;
    var x = radius + 50;
    var y = radius + 50;
    two.add(this.es.generateEisberg(radius, x, y, b, 0, a))
//     var group = two.makeGroup()
//     var circle = two.makePolygon(x, y, radius, 3);
//     var circle2 = two.makePolygon(x, circle.beginning+50 ,20, 3);
//     //var circle = two.makeStar(x, y, radius, 250, 3)
//
//     group.add(circle);
//     group.add(circle2)


// The object returned has many stylable properties:

    //circle.fill = Gradient();
// And accepts all valid CSS color:
//     var gradLinB =  this.generateGradient(a);
//       /*var gradLinB = new LinearGradient(
//       0, 0,
//       0,
//       1,
//       [
//         new Two.Stop(0.0, "red", 1),
//         new Two.Stop(0.0, "green", 1),
//         new Two.Stop(0.2, "green", 1),
//         new Two.Stop(0.2, "blue", 1),
//         new Two.Stop(0.4, "blue", 1),
//         new Two.Stop(0.4, "green", 1),
//         new Two.Stop(0.7, "green", 1),
//         new Two.Stop(0.8, "blue", 1),
//         new Two.Stop(0.9, "blue", 1),
//         new Two.Stop(1, "black", 1),
//         new Two.Stop(1, "white", 1),
//       ]
//     );
//
//        */
//
//
//
//
//     //circle.matrix = circle.matrix.skewX(200)
//     // -0.7 to 0.7
//     circle.skewX = this.generateSkewX(b, -1, 1)
//     //circle.height = 300;
//     circle.fill = gradLinB;
//     circle.stroke = 'orangered';
//     circle.linewidth = 5;


// Don’t forget to tell two to draw everything to the screen
    two.update();
  }

  // //generate the tilt of the triangle
  // generateSkewX(value: number, min: number, max: number): number{
  //   var minSkew = -0.7
  //   var maxSkew = 0.7
  //   //min -1 max 1
  //   return (value - min) / (max - min) * (maxSkew - minSkew) + minSkew;
  // }

  // //generates the gradient and makes usage of generateStops
  // generateGradient(value: number): LinearGradient{
  //   var tanhVal = Math.tanh(value);
  //   var stops = this.generateStops(tanhVal);
  //   return new LinearGradient(0, 0,
  //     0,
  //     1, stops)
  // }
  //
  // //generates the stops according to the tan value
  // generateStops(value: number): Array<Stop>{
  //   var stopsPredefined = [
  //     new Two.Stop(0.0, "green", 1),
  //     //new Two.Stop(0.2, "green", 1),
  //     new Two.Stop(0.0, "blue", 1),
  //   ]
  //   var grads=20
  //
  //   if(value>0){
  //     grads = Math.ceil((value+1)*grads)
  //   }
  //   if(value<0){
  //     grads = Math.ceil((value+1)*grads)
  //   }
  //
  //   var gradsDist =  1/grads
  //
  //   var stops = [new Two.Stop(0.0, "green", 1)];
  //
  //   var distInLoop = 0
  //
  //   for(let i = 0; i < grads; i++){
  //     if(i%2==1){
  //       stops.push(
  //         new Two.Stop(distInLoop, "green", 1)
  //       )
  //       distInLoop = distInLoop+gradsDist
  //       //stops.push(new Two.Stop( distInLoop, "green", 1))
  //     }else{
  //       stops.push(
  //         new Two.Stop(distInLoop, "blue",1)
  //       )
  //       distInLoop = distInLoop+gradsDist
  //       //stops.push(new Two.Stop( distInLoop, "blue", 1))
  //     }
  //     stops.push()
  //   }
  //   if(grads % 2 == 1){
  //     stops.push(new Two.Stop( 1, "green", 1))
  //   }
  //   else {
  //     stops.push(new Two.Stop( 1, "blue", 1))
  //
  //   }
  //   return stops
  // }
  //



  ngOnInit(): void {
  }
}
