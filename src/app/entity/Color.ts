export class Color {
  get b(): number {
    return this._b;
  }
  get g(): number {
    return this._g;
  }
  get r(): number {
    return this._r;
  }

  // @ts-ignore
  private _r: number;
  // @ts-ignore
  private _g: number;
  // @ts-ignore
  private _b: number;

  constructor(color: number|string) {
    if(typeof color  == "number"){
      this.fromNumber(color);
    }else{
      if(color.search("#") != -1){
        let numberColor = parseInt(color.substring(1, 7), 16);
        this.fromNumber(numberColor);
      } else if(color.search("rgb") != -1 && color.search(/\(/) != -1){
        this.fromRgbString(color);
      } else {
        let colorString =  this.getColorData(color);
        this.fromRgbString(colorString);
      }
    }
  }

  /** use as factory, which takes r,g,b and returns a Color
   *
   * @param r
   * @param g
   * @param b
   */
  static fromRGB(r: number, g: number, b: number):Color{
    return new Color((r*(256**2)) + (g*(256)) + b);
  }


  /**
   * generates array with r as the first, g as the second and b as the third element
   */
  public getColorVector(){
    return [this.r, this.g, this.b];
  }

  /**
   * generates a css-style hex string for the color
   */
  public getHexString(): string{


    // Convert the color channels to hex codes
    let rHex = this.r.toString(16).padStart(2, '0');

    let gHex = this.g.toString(16).padStart(2, '0');
    let bHex = this.b.toString(16).padStart(2, '0');

    // Concatenate the hex codes into a single string
    return `#${rHex}${gHex}${bHex}`;
  }


  /** sets the r,g,b attributes of this class from a given integer
   *
   * @param color
   * @private
   */
  private fromNumber(color: number){
    this._r = (color & 0xFF0000)/256**2;
    this._g = (color & 0xFF00)/256;
    this._b = color & 0xFF;
  }


  /** sets r,g,b given a string in the form 'rgb(x,y,z)'
   *
   * @param color
   * @private
   */
  private fromRgbString(color: string){
    let posBraces = color.search(/\(/);
    this._r = parseInt(color.substring(posBraces + 1, this.getPosition(color, ",", 1)));
    this._g = parseInt(color.substring(color.search(",") + 1), this.getPosition(color, ",", 2) -  1);
    this._b = parseInt(color.substring(this.getPosition(color, ",", 2) + 1, this.getPosition(color, ",", 3)));
  }

  /** helper method for getting the position of a substring in a string, given the index of the occurrence
   *
   * @param string
   * @param subString
   * @param index
   * @private
   */
  private getPosition(string: string, subString: string, index: number) {
    return string.split(subString, index).join(subString).length;
  }


  /** if the color is given as a name (e.g. 'blue', 'green') this function generates a representation
   * in a rgb-string ('rgb(x,y,z)')
   *
   * @param color
   * @private
   */
  private getColorData(color: string): string{
    let d = document.createElement("div");
    d.style.color = color;
    document.body.appendChild(d)
//Color in RGB
    let colorComp = window.getComputedStyle(d).color;
    d.remove();

    return colorComp;
  }
}
