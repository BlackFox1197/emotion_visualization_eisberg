import {Line} from "two.js/src/shapes/line";
import Two from "two.js";
import {CanvasjsCancerComponent} from "../features/iceberg-manual-preview/canvasjs-cancer/canvasjs-cancer.component";

export class Interval{
  leftLine: Line =   new Two.Line(0,0,0,200);
  rightLine: Line =   new Two.Line(0,0,0,200);
  vertLine: Line =   new Two.Line(0,0,0,200);


  constructor(public wt: widthTransport, public zoomer = false, public intervallSize: number = 0) {
    this.vertLine.stroke="green"
    this.vertLine.linewidth =3
    this.vertLine.visible =false
    this.leftLine.stroke="red"
    this.leftLine.linewidth =2
    this.leftLine.visible = false
    this.rightLine.stroke="red"
    this.rightLine.linewidth =2
    this.rightLine.visible = false

    if(zoomer){
      this.vertLine.visible =false
      this.leftLine.stroke="blue"
      this.leftLine.linewidth =2
      this.leftLine.visible = false
      this.rightLine.stroke="blue"
      this.rightLine.linewidth =2
      this.rightLine.visible = false
    }
  }

  setInterVallzize(size: number): void{
    this.intervallSize = size;
  }

  move(positionX: number){
    if(positionX -this.intervallSize/2 >= 0 && positionX + this.intervallSize/2 <= this.wt.width) {

      this._moveLine(this.vertLine, positionX, 0)
      this._moveLine(this.leftLine, positionX, -this.intervallSize / 2)
      this._moveLine(this.rightLine, positionX, this.intervallSize / 2)

      if(this.zoomer){
        this.vertLine.visible = false;
      }
    }
  }

  getVertlinePosition(){
    return this.vertLine.vertices[0].x;
  }
  getStartLinePosition(){
    return this.leftLine.vertices[0].x;
  }
  getEndlinePosition(){
    return this.rightLine.vertices[0].x;
  }

  setPositionAndIntervalSize(positionX: number, size: number){
    this.intervallSize = size;
    this.move(positionX);
  }

  private _moveLine(line: Line, x: number, dist: number) {
    line.visible = true;
    const [anchor1, anchor2] = line.vertices
    anchor1.set(x + dist, anchor1.y)
    anchor2.set(x + dist, anchor2.y)
  }
}


export interface widthTransport{
  width: number
}
