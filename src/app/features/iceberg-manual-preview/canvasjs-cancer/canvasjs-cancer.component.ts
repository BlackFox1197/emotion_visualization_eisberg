import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import Two from "two.js";

@Component({
  selector: 'app-canvasjs-cancer',
  templateUrl: './canvasjs-cancer.component.html',
  styleUrls: ['./canvasjs-cancer.component.scss']
})
export class CanvasjsCancerComponent implements OnInit{

  // chart: Two;
  // chartOptions = {
  //   title: {
  //     text: "Load MP3 File",
  //     fontFamily: "Trebuchet MS, Helvetica, sans-serif",
  //     dockInsidePlotArea: true,
  //     verticalAlign: "center"
  //   },
  //   axisX: {
  //     tickLength: 0,
  //     lineThickness: 0,
  //     labelFontSize: 0,
  //     labelFormatter: function(e: any) {
  //       return "";
  //     }
  //   },
  //   axisY: {
  //     tickLength: 0,
  //     lineThickness: 0,
  //     gridThickness: 0,
  //     labelFontSize: 0,
  //     labelFormatter: function(e: any) {
  //       return "";
  //     }
  //   },
  //   data: [{
  //     type: "rangeArea",
  //     toolTipContent: null,
  //     highlightEnabled: false,
  //     color: "#ff6862",
  //     dataPoints: []
  //   }]
  // }
  //
  // getChartInstance = (chart: any) => {
  //   this.chart = chart;
  // }
  //
  // audioContext: any;
  // source: any;
  // buttonStatus: boolean = false;
  // intervalId: any;
  //
  // onFileSelected = async (event: any) => {
  //   let file:File = event.target.files[0];
  //   if (file) {
  //     this.chart.title.set("text", "Loading File...");
  //     let margin = 10,
  //       chunkSize = 500,
  //       height = this.chart.get("height"),
  //       scaleFactor = (height - margin * 2) / 2;
  //
  //     this.audioContext = new AudioContext();
  //
  //     let buffer = await file.arrayBuffer(),
  //       audioBuffer = await this.audioContext.decodeAudioData(buffer),
  //       float32Array = audioBuffer.getChannelData(0);
  //
  //     let array = [], i = 0, length = float32Array.length;
  //
  //     while (i < length) {
  //       array.push(
  //         float32Array.slice(i, i += chunkSize).reduce(function (total: any, value: any) {
  //           return Math.max(total, Math.abs(value));
  //         })
  //       );
  //     }
  //     let dps = []
  //     for (let index in array) {
  //       dps.push({ x: margin + Number(index), y: [height / 2 - array[index] * scaleFactor, height / 2 + array[index] * scaleFactor]});
  //     }
  //     this.chart.options.data[0].dataPoints = dps;
  //     this.chart.options.title.text = file.name;
  //     this.chart.render();
  //     this.chart.axisY[0].set("minimum", 0, false);
  //     this.chart.axisY[0].set("maximum", dps[0].y[0] * 2, false);
  //     this.chart.axisX[0].addTo("stripLines", {startValue: 0, endValue: 0, showOnTop: true, color: "#fff", opacity: 0.7});
  //
  //     this.source = this.audioContext.createBufferSource();
  //     this.source.buffer = audioBuffer;
  //     this.source.loop = false;
  //     this.source.connect(this.audioContext.destination);
  //
  //     this.source.start();
  //
  //     this.source.onended = () => {
  //       this.chart.axisX[0].stripLines[0].set("endValue", this.chart.axisX[0].get("maximum"));
  //       clearInterval(this.intervalId);
  //     }
  //     this.intervalId = setInterval(() => {
  //       this.chart.axisX[0].stripLines[0].set("endValue", this.audioContext.currentTime * (this.chart.data[0].dataPoints.length / audioBuffer.duration));
  //     }, 50);
  //   }
  // }
  //
  // togglePlaying = (event: any) => {
  //   if(this.audioContext) {
  //     if(this.audioContext.state === 'running') {
  //       this.audioContext.suspend().then(() => {
  //         this.buttonStatus = !this.buttonStatus;
  //       });
  //     }
  //     else if(this.audioContext.state === 'suspended') {
  //       this.audioContext.resume().then(() => {
  //         this.buttonStatus = !this.buttonStatus;
  //       });
  //     }
  //   }
  // }
  //
  // stopPlaying = (event: any) => {
  //   this.source.stop();
  // }
  //
  // ngOnDestroy = () => {
  //   if(this.intervalId) {
  //     clearInterval(this.intervalId);
  //   }
  //   if(this.chart)
  //     this.chart.destroy();
  // }

  //@ViewChild('test') canvas?: ElementRef;


  canvas?: HTMLCanvasElement = document.querySelector("canvas") ?? undefined;
  ctx?: CanvasRenderingContext2D = this.canvas?.getContext("2d") ?? undefined;
  click(event: any){
    let position = event.x - (this.canvas?.offsetLeft ?? 0);
    this.drawLineSegment2(this.ctx, position, 300, 0, false);

    //this.drawLineSegment(this.ctx)
  }

  ngOnInit() {

    this.audioDrawer('/assets/test.mp3')
  }

  async evToFile(event: any){
    //var array = this.onFileSelected(event);
    //this.fileName = event.target.value
    const file:File = event.target.files[0];
    const fileURL = URL.createObjectURL(file);
    this.audioDrawer(fileURL)


    return event;
  }




  audioDrawer(url: string): void{

    // Set up audio context
    const audioContext = new AudioContext();

    /**
     * Retrieves audio from an external source, the initializes the drawing function
     * @param {String} url the url of the audio we'd like to fetch
     */

      fetch(url)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
        .then(audioBuffer => this.draw(this.normalizeData(this.filterData(audioBuffer))));





  }


  /**
   * Filters the AudioBuffer retrieved from an external source
   * @param {AudioBuffer} audioBuffer the AudioBuffer from drawAudio()
   * @returns {Array} an array of floating point numbers
   */
  filterData  (audioBuffer: AudioBuffer): Array<any>{
    const rawData = audioBuffer.getChannelData(0); // We only need to work with one channel of data
    const samples = 3000; // Number of samples we want to have in our final data set
    const blockSize = Math.floor(rawData.length / samples); // the number of samples in each subdivision
    const filteredData = [];
    for (let i = 0; i < samples; i++) {
      let blockStart = blockSize * i; // the location of the first sample in the block
      let sum = 0;
      for (let j = 0; j < blockSize; j++) {
        sum = sum + Math.abs(rawData[blockStart + j]); // find the sum of all the samples in the block
      }
      filteredData.push(sum / blockSize); // divide the sum by the block size to get the average
    }
    return filteredData;
  };

  /**
   * Normalizes the audio data to make a cleaner illustration
   * @param {Array} filteredData the data from filterData()
   * @returns {Array} an normalized array of floating point numbers
   */
  normalizeData (filteredData: Array<any>): Array<any> {
    const multiplier = Math.pow(Math.max(...filteredData), -1);
    return filteredData.map(n => n * multiplier);
  }

  /**
   * Draws the audio file into a canvas element.
   * @param {Array} normalizedData The filtered array returned from filterData()
   * @returns {Array} a normalized array of data
   */
  draw (normalizedData: Array<any>): void {
    // set up the canvas
    this.canvas = document.querySelector("canvas") ?? new HTMLCanvasElement();
    const dpr = window.devicePixelRatio || 1;
    const padding = 5;
    this.canvas.width = this.canvas.offsetWidth * dpr;
    this.canvas.height = (this.canvas.offsetHeight + padding * 2) * dpr;
    this.ctx = this.canvas.getContext("2d")!;
    const ctx = this.ctx;
    ctx.scale(dpr, dpr);
    ctx.translate(0, this.canvas.offsetHeight / 2 + padding); // set Y = 0 to be in the middle of the canvas

    // draw the line segments
    const width = this.canvas.offsetWidth / normalizedData.length;
    for (let i = 0; i < normalizedData.length; i++) {
      const x = width * i;
      let height = normalizedData[i] * this.canvas.offsetHeight - padding;
      if (height < 0) {
        height = 0;
      } else if (height > this.canvas.offsetHeight / 2) {
        height = this.canvas.offsetHeight / 2;
      }
      this.drawLineSegment(ctx, x, height, width, (i + 1) % 2 == 0);
    }
    this.drawLineSegment2(ctx, 300, 300, width, false);
    this.drawLineSegment2(ctx, 400, 300, width, false);
  };


  /**
   * A utility function for drawing our line segments
   * @param {AudioContext} ctx the audio context
   * @param {number} x  the x coordinate of the beginning of the line segment
   * @param {number} height the desired height of the line segment
   * @param {number} width the desired width of the line segment
   * @param {boolean} isEven whether or not the segmented is even-numbered
   */
  drawLineSegment(ctx: any, x: number, height: number, width:number, isEven:boolean): void {
    ctx.lineWidth = 1; // how thick the line is
    ctx.strokeStyle = "#ffffff"; // what color our line is
    ctx.beginPath();
    height = isEven ? height : -height;
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    //ctx.arc(x + width / 2, height, width / 2, Math.PI, 0, isEven);
    ctx.lineTo(x + width, 0);
    ctx.stroke();
  };


  drawLineSegment2(ctx: any, x: number, height: number, width:number, isEven:boolean): void {
    ctx.lineWidth = 5; // how thick the line is
    ctx.strokeStyle = "#FF0000"; // what color our line is
    ctx.beginPath();
    height = isEven ? height : -height;
    ctx.moveTo(x, -x);
    ctx.lineTo(x, height);
    //ctx.arc(x + width / 2, height, width / 2, Math.PI, 0, isEven);
    ctx.lineTo(x + width, 100);
    ctx.stroke();
  };
}
