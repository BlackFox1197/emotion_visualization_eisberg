import { Injectable } from '@angular/core';





@Injectable({
  providedIn: 'root'
})
export class AudioService {

  constructor() { }


  async getAudioBufferFromFile(fileURL: string): Promise<AudioBuffer> {


    const audioContext = new AudioContext();

    return fetch(fileURL)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer));
      //.then(audioBuffer => this.normalizeData(this.filterData(audioBuffer)));
  }


  generateDataPoints(buffer: AudioBuffer): Array<any>{
    return this._normalizeData(this._filterData(buffer));
  }

  calculateAudioLenght(buffer: AudioBuffer) : number{
    return buffer.duration;
  }



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
   * @returns {Array} an array of floating point numbers
   */
  private _filterData  (audioBuffer: AudioBuffer): Array<any>{
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
}
