import { Injectable } from '@angular/core';
import {Polygon} from "two.js/src/shapes/polygon";
import {LinearGradient} from "two.js/src/effects/linear-gradient";
import {Stop} from "two.js/src/effects/stop";
import Two from "two.js";

@Injectable({
  providedIn: 'root'
})
export class EisbergService {

  constructor() { }

  /** generate our whole iceberg with customizable paramters
   *
   * @param radius
   * @param x
   * @param y
   * @param options
   */
  generateEisberg(radius: number, x: number, y: number,
                  options: {
                    skewPara?: number,
                    colorPara?: number,
                    patternPara?: number,
                    color1: string,
                    color2: string}): Polygon{
    var poly = new Polygon(x, y ,radius, 3);


    var gradLinB =  this.generateGradient(options.patternPara ?? 0);
    // -0.7 to 0.7
    poly.skewX = this.generateSkewX(options.skewPara ?? 0, -1, 1)
    //circle.height = 300;
    poly.fill = gradLinB;
    poly.stroke = 'orangered';
    poly.linewidth = 5;
    return poly;

  }

  rgbToHex(r:number ,g:number,b:number): string{
    var value = r*16^4 + g*16^2 + b;
    return '#' + value.toString(16);

    //return"#"+((1<<24)+(r<<16)+(g<<8)+ b).toString(16).slice(1);
  }

  sampleColor(value: number, color1: string, color2: string) : string {
    // Convert x to the range 0-160
    let colorIndex = Math.round((value + 1) * 80);

    let color1Int = parseInt(color1, 16)
    let color2Int = parseInt(color2, 16)

    // Define the two colors to interpolate between
    let color1Vec = [color1Int&&0xFF0000, color1Int&&0x00FF,color1Int&&0xFF];  // Red
    let color2Vec = [color2Int&&0xFF0000, color2Int&&0x00FF,color2Int&&0xFF];  // Blue

    // Interpolate the R, G, and B values
    let r = (color2Vec[0] - color1Vec[0]) * (colorIndex/160) + color1Vec[0];
    let g = (color2Vec[1] - color1Vec[1]) * (colorIndex/160) + color1Vec[1];
    let b = (color2Vec[2] - color1Vec[2]) * (colorIndex/160) + color1Vec[2];

    return `rgb(${r}, ${g}, ${b})`;
  }

  generateColorHex(value: number, color1: number, color2: number): string{
    //generate 2 colors given by a number between -1 and 1
    var hexCol = this.rgbToHex(252, 170, 0)
    return "FFFFFF";
  }


  /**generate the tilt of the triangle
   *
   * @param value
   * @param min
   * @param max
   * @private
   */
  private generateSkewX(value: number, min: number, max: number): number{
    var minSkew = -0.7
    var maxSkew = 0.7
    //min -1 max 1
    return (value - min) / (max - min) * (maxSkew - minSkew) + minSkew;
  }

  /**generates the gradient and makes usage of generateStops
   *
   * @param value
   */
  private generateGradient(value: number, color: number): LinearGradient{
    var tanhVal = Math.tanh(value);
    var stops = this.generateStops(tanhVal, color);
    return new LinearGradient(0, 0,
      0,
      1, stops)
  }

  /**
   * generates the stops according to the tan value
   *
   * @param value
   * @param color
   */
  private generateStops(value: number, color: number): Array<Stop>{

    let color1 = Math.max(color - 0x060606, 0);
    let color2 = color;
    var stopsPredefined = [
      new Two.Stop(0.0, "green", 1),
      //new Two.Stop(0.2, "green", 1),
      new Two.Stop(0.0, "blue", 1),
    ]
    var grads=20

    if(value>0){
      grads = Math.ceil((value+1)*grads)
    }
    if(value<0){
      grads = Math.ceil((value+1)*grads)
    }

    var gradsDist =  1/grads

    var stops = [new Two.Stop(0.0, "green", 1)];

    var distInLoop = 0

    for(let i = 0; i < grads; i++){
      if(i%2==1){
        stops.push(
          new Two.Stop(distInLoop, "green", 1)
        )
        distInLoop = distInLoop+gradsDist
        //stops.push(new Two.Stop( distInLoop, "green", 1))
      }else{
        stops.push(
          new Two.Stop(distInLoop, "blue",1)
        )
        distInLoop = distInLoop+gradsDist
        //stops.push(new Two.Stop( distInLoop, "blue", 1))
      }
      stops.push()
    }
    if(grads % 2 == 1){
      stops.push(new Two.Stop( 1, "green", 1))
    }
    else {
      stops.push(new Two.Stop( 1, "blue", 1))

    }
    return stops
  }
}
