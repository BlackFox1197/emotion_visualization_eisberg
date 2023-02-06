import {Injectable} from '@angular/core';
import {Polygon} from "two.js/src/shapes/polygon";
import {LinearGradient} from "two.js/src/effects/linear-gradient";
import {Stop} from "two.js/src/effects/stop";
import Two from "two.js";
import {ColorService} from "./color.service";
import {Color} from "../../entity/Color";
import {IcebergParams} from "../../entity/Icebergparams";
import {IceBergConfig} from "../../entity/IceBergConfig";

@Injectable({
  providedIn: 'root'
})
export class EisbergService {

  color1 = new Color("#00FFBB")
  color2 = new Color("#AA00FF")

  borderCol1 = new Color("#FF00BB")
  borderCol2 = new Color("#00FFAA")

  constructor(private cs: ColorService) { }

  /** generate our whole iceberg with customizable paramters
   *
   * @param radius
   * @param x
   * @param y
   * @param config
   */
  generateEisberg(radius: number, x: number, y: number, config: IceBergConfig): Polygon{
    var poly = new Polygon(x, y ,radius, 3);

    // color1 = this.cs.getColorData(color1);
    // color2 = this.cs.getColorData(color2);
    // console.log(color1)
    var gradLinB =  this.generateGradient(config.params.frequency ?? 0, this.cs.sampleColor(config.params.colorParam ?? 0, this.color1, this.color2));
    this.changeTheme(this.color1.getHexString(), this.color2.getHexString())
    //var gradLinB = color1.getHexString();
    // -0.7 to 0.7
    poly.skewX = this.generateSkewX(config.params.skew ?? 0, -1, 1)
    //circle.height = 300;
    poly.fill = gradLinB;
    poly.stroke = this.generateBorderColor(config.params.borderParam ?? 0, -1, 1 );
    //poly.linewidth = this.generateLineWidght(config.params.borderParam ?? 0, -1, 1);
    poly.linewidth = 6;
    poly.height= this.generatePolyHeight(poly,config.params.height?? 0, -1, 1)

    return poly;

  }


  public genStepComplexParams(params1:IcebergParams, params2:IcebergParams, elapsed:number): IcebergParams{
    let mapper = (valNew: number, valOld: number) => (valNew*elapsed)-(valOld*(1-elapsed))
    let params: IcebergParams ={
      frequency: mapper(params2.frequency!, params1.frequency!),
      colorParam: mapper(params2.colorParam!, params1.colorParam!),
      borderParam: mapper(params2.borderParam!, params1.borderParam!)
    }
    return params;
  }

  public getGradFromParams(params: IcebergParams){
    return  this.generateGradient(params.frequency ?? 0, this.cs.sampleColor(params.colorParam ?? 0, this.color1, this.color2));
  }


  public getBorderFromParams(params: IcebergParams){
    return this.generateBorderColor(params.borderParam ?? 0, -1, 1 );
  }


  updateIceberg(iceberg: Polygon, newParams: IcebergParams): void{
    if(newParams.skew != undefined || newParams.skew != null){
      iceberg.skewX = this.generateSkewX(newParams.skew, -1, 1)
    }
    if(newParams.borderParam != undefined || newParams.borderParam != null){
      iceberg.stroke = this.generateBorderColor(newParams.borderParam ?? 0, -1, 1)
      iceberg.linewidth = this.generateLineWidght(newParams.borderParam ?? 0, -1, 1)
    }
    if(newParams.colorParam != undefined || newParams.colorParam != null){
      iceberg.fill = this.generateGradient(newParams.frequency ?? 0, this.cs.sampleColor(newParams.colorParam, this.color1, this.color2));
    }
    if(newParams.height !=undefined || newParams.height !=null){
      iceberg.height = this.generatePolyHeight(iceberg, newParams.height?? 0, -1, 1)
    }
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
   * @param color
   */
  public generateGradient(value: number, color: Color): LinearGradient{
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
  private generateStops(value: number, color: Color): Array<Stop>{

    let color1 = this.cs.generateSecondColor(color);
    let color2 = color.getHexString();
    var stopsPredefined = [
      new Two.Stop(0.0, color2, 1),
      //new Two.Stop(0.2, "green", 1),
      new Two.Stop(0.0, color1.getHexString(), 1),
    ]
    var grads=20

    if(value>0){
      grads = Math.ceil((value+1)*grads)
    }
    if(value<0){
      grads = Math.ceil((value+1)*grads)
    }

    var gradsDist =  1/grads

    var stops = [new Two.Stop(0.0, color2, 1)];

    var distInLoop = 0

    for(let i = 0; i < grads; i++){
      if(i%2==1){
        stops.push(
          new Two.Stop(distInLoop, color2, 1)
        )
        distInLoop = distInLoop+gradsDist
        //stops.push(new Two.Stop( distInLoop, color2, 1))
      }else{
        stops.push(
          new Two.Stop(distInLoop, color1.getHexString(),1)
        )
        distInLoop = distInLoop+gradsDist
        //stops.push(new Two.Stop( distInLoop, color1, 1))
      }
      stops.push()
    }
    if(grads % 2 == 1){
      stops.push(new Two.Stop( 1, color2, 1))
    }
    else {
      stops.push(new Two.Stop( 1, color1.getHexString(), 1))

    }
    return stops
  }
  private changeTheme(primary: string, secondary: string) {
    document.documentElement.style.setProperty('--primary-color', primary);
    document.documentElement.style.setProperty('--secondary-color', secondary);
  }

  private generateBorderColor(borderParam: number, number: number, number2: number) {
    return this.cs.sampleColor(borderParam, this.borderCol1, this.borderCol2).getHexString()
  }

  private generateLineWidght(borderParam: number, min: number, max: number) {
    var minPix = 1
    var maxPix = 10
    //min -1 max 1
    return (borderParam - min) / (max - min) * (maxPix - minPix) + minPix;
  }

  private generatePolyHeight(poly: Polygon, heightParam:number, min:number, max:number){
    // 1/4 height to translation
    //poly.translation.add(new Vector(0,80))

    var minHeight =200
    var maxHeight = 400
    //min -1 max 1
    var value = (heightParam - min) / (max - min) * (maxHeight - minHeight) + minHeight;
    poly.translation.add(new Two.Vector(0,(poly.height-value)/4))
    //console.log(value)
    return value
  }
}
