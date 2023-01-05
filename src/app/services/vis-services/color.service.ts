import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColorService {

  constructor() { }



//   getColorData(color: string): string{
//     let d = document.createElement("div");
//     d.style.color = color;
//     document.body.appendChild(d)
// //Color in RGB
//     let colorComp = window.getComputedStyle(d).color;
//     const rgba2hex = (rgba: string) => `#${rgba.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.{0,1}\d*))?\)$/)?.slice(1).map((n, i) => (i === 3 ? Math.round(parseFloat(n) * 255) : parseFloat(n)).toString(16).padStart(2, '0').replace('NaN', '')).join('')}`
//     d.remove();
//
//     return rgba2hex(rgba2hex(colorComp));
//   }

  colorNumberToHexString(color: number): string{
    let r = Math.round(color % 256);
    let g = Math.round((color / 256) % 256);
    let b = Math.round((color / (256 * 256)) % 256);
    return this.rgbToHexString(r, g, b);
  }

  // rgbToHexString(r:number , g:number, b:number): string{
  //   var value = r*(16^4) + g*(16^2) + b;
  //   console.log(value, 'value', r, g,  b , 'rgb')
  //   return '#' + value.toString(16);
  //
  //   //return"#"+((1<<24)+(r<<16)+(g<<8)+ b).toString(16).slice(1);
  // }

  rgbToHexString(r:number , g:number, b:number): string{


    // Convert the color channels to hex codes
    let rHex = r.toString(16).padStart(2, '0');

    let gHex = g.toString(16).padStart(2, '0');
    let bHex = b.toString(16).padStart(2, '0');

    // Concatenate the hex codes into a single string
    return `#${rHex}${gHex}${bHex}`;
  }

  rgbToHewNumber(r:number , g:number, b:number): number{
    return r*(16^4) + g*(16^2) + b;
  }

  sampleColor(value: number, color1: string, color2: string) : number {
    // Convert x to the range 0-160
    let colorIndex = Math.round((value + 1) * 80);
    console.log(value, color1, color2, colorIndex)

    let color1Int = parseInt(color1, 16)
    let color2Int = parseInt(color2, 16)

    // Define the two colors to interpolate between
    let color1Vec = this.colorNumberTo3DimVector(color1Int);
    let color2Vec = this.colorNumberTo3DimVector(color2Int);

    // Interpolate the R, G, and B values
    let r = Math.round((color2Vec[0] - color1Vec[0]) * (colorIndex/160) + color1Vec[0]);
    let g = Math.round((color2Vec[1] - color1Vec[1]) * (colorIndex/160) + color1Vec[1]);
    let b = Math.round((color2Vec[2] - color1Vec[2]) * (colorIndex/160) + color1Vec[2]);

    console.log(color1Vec)
    return this.rgbToHewNumber(r, g, b);
  }

  generateSecondColor(color: number, distance = 110): string{
    let r = Math.round(color % 256);
    let g = Math.round((color / 256) % 256);
    let b = Math.round((color / (256 * 256)) % 256);

    if(r > distance){
      r -=  distance;
    }
    if(g > distance){
      g -= distance;
    }
    if(b > distance){
      b -= distance;
    }

    return this.rgbToHexString(r, g, b)

  }

  colorNumberTo3DimVector(color: number){
    let r = Math.round(color % 256);
    let g = Math.round((color / 256) % 256);
    let b = Math.round((color / (256 * 256)) % 256);

    return [r, g, b]
  }


}
