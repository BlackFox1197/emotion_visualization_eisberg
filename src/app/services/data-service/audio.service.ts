import { Injectable } from '@angular/core';





@Injectable({
  providedIn: 'root'
})
export class AudioService {

  constructor() { }


  source?: AudioBufferSourceNode;



  async getAudioBufferFromFile(fileURL: string): Promise<AudioBuffer> {


    const audioContext = new AudioContext();



    return fetch(fileURL)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer));
      //.then(audioBuffer => this.normalizeData(this.filterData(audioBuffer)));
  }


  generateDataPoints(buffer: AudioBuffer, sampleCount: number): Array<any>{
    return this._normalizeData(this._filterData(buffer, sampleCount));
  }

  calculateAudioLenght(buffer: AudioBuffer) : number{
    return buffer.duration;
  }

  playSelection(buffer: AudioBuffer, offset: number, duration?: number){
    this.stopSource();
    let context = new AudioContext()
    this.source = context.createBufferSource(); // creates a sound source
    this.source.buffer = buffer;                    // tell the source which sound to play
    this.source.connect(context.destination);       // connect the source to the context's destination (the speakers)
    this.source.start(0, offset, duration);
  }

  // playWhole(buffer: AudioBuffer){
  //   this.stopSource();
  //   let context = new AudioContext()
  //   this.source = context.createBufferSource(); // creates a sound source
  //   this.source.buffer = buffer;                    // tell the source which sound to play
  //   this.source.connect(context.destination);       // connect the source to the context's destination (the speakers)
  //   //source.context.addEventListener("statechange", () => {console.log("asd")})
  //   this.source.start(0);
  // }

  stopSource(){
    if(this.source??0 != 0){
      this.source!.stop();
    }
  }

  //
  // resumeSource(time: number){
  //   if(this.source??0 != 0){
  //     this.source!.start(0, time);
  //   }
  // }

  /**
   * Normalizes the audio data to make a cleaner illustration
   * @param {Array} filteredData the data from filterData()
   * @returns {Array} an normalized array of floating point numbers
   */
  private _normalizeData (filteredData: Array<any>): Array<any> {
    const multiplier = Math.pow(Math.max(...filteredData), -1);
    return filteredData.map(n => n * multiplier);
  }


  /**
   * Filters the AudioBuffer retrieved from an external source
   * @param {AudioBuffer} audioBuffer the AudioBuffer from drawAudio()
   * @param samples the number of samples in the array
   * @returns {Array} an array of floating point numbers
   */
  private _filterData  (audioBuffer: AudioBuffer, samples: number): Array<any>{
    const rawData = audioBuffer.getChannelData(0); // We only need to work with one channel of data
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


  generateFile(buffer: AudioBuffer){
  }
}
