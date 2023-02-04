import {Injectable} from '@angular/core';
import {Color} from "../../entity/Color";

@Injectable({
  providedIn: 'root'
})
export class ColorService {

  constructor() {}

  sampleColor(value: number, color1: Color, color2: Color) : Color {
    // Convert x to the range 0-160
    let colorIndex = Math.round((value + 1) * 80);
    //console.log(value, color1, color2, colorIndex)


    // Define the two colors to interpolate between
    let color1Vec = color1.getColorVector();
    let color2Vec = color2.getColorVector();

    // Interpolate the R, G, and B values
    let r = Math.round((color2Vec[0] - color1Vec[0]) * (colorIndex/160) + color1Vec[0]);
    let g = Math.round((color2Vec[1] - color1Vec[1]) * (colorIndex/160) + color1Vec[1]);
    let b = Math.round((color2Vec[2] - color1Vec[2]) * (colorIndex/160) + color1Vec[2]);

    //console.log(color1Vec)
    return Color.fromRGB(r, g, b);
  }

  generateSecondColor(color: Color, distance = 80): Color{
    let r = color.r;
    let g = color.g;
    let b = color.b;

    //so we stay in the color space
    if(distance > 125){
      distance = 125;
    }

    if(r > distance && r > 130){
      r -=  distance;
    }
    else{
      r += distance;
    }
    if(g > distance && g > 130){
      g -= distance;
    }
    else{
      g += distance;
    }
    if(b > distance && b > 130){
      b -= distance;
    }else {
      b += distance;
    }

    return Color.fromRGB(r, g, b);
  }
}
