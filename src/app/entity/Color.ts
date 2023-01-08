class Color {

  r: number;
  g: number;
  b: number;

  constructor(color: number|string) {
    if(typeof color  == "number"){
      this.fromNumber(color);
    }else{
      if(color.search("#") != -1){
        let numberColor = parseInt(color.substring(1, 7), 16);
        this.fromNumber(numberColor);
      } else if(color.search("rgb") != -1 && color.search("(") != -1){
        this.fromRgbString(color);
      } else {
        let colorString =  this.getColorData(color);
        this.fromRgbString(colorString);
      }
    }
  }

  private fromNumber(color: number){
    this.r = (color & 0xFF0000)/256**2;
    this.g = (color & 0xFF00)/256**2;
    this.b = color & 0xFF;
  }

  private fromRgbString(color: string){
    let posBraces = color.search("(");
    this.r = parseInt(color.substring(posBraces + 1, color.search(",") - 1));
    this.g = parseInt(color.substring(color.search(",") + 1), this.getPosition(color, ",", 2) -  1);
    this.b = parseInt(color.substring(this.getPosition(color, ",", 2) + 1, this.getPosition(color, ",", 3)));
  }

  private getPosition(string: string, subString: string, index: number) {
    return string.split(subString, index).join(subString).length;
  }


    private getColorData(color: string): string{
    let d = document.createElement("div");
    d.style.color = color;
    document.body.appendChild(d)
//Color in RGB
    let colorComp = window.getComputedStyle(d).color;
    const rgba2hex = (rgba: string) => `#${rgba.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.{0,1}\d*))?\)$/)?.slice(1).map((n, i) => (i === 3 ? Math.round(parseFloat(n) * 255) : parseFloat(n)).toString(16).padStart(2, '0').replace('NaN', '')).join('')}`
    d.remove();

    return rgba2hex(rgba2hex(colorComp));
  }
}
