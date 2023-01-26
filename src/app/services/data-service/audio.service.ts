import { Injectable } from '@angular/core';
import {combineTransforms} from "@angular/cdk/drag-drop/drag-styling";
import {coerceArray} from "@angular/cdk/coercion";

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  constructor() {}

  source?: AudioBufferSourceNode;
  analyzer?: AnalyserNode;
  sampleRate?: number;

  ft = require('types-fourier-transform')

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

    this.analyzer = context.createAnalyser()      //analyzer stuff
    this.analyzer.fftSize = 2048                //size of our fft and /2 our frequency bin count

    this.source = context.createBufferSource(); // creates a sound source
    this.source.buffer = buffer;                    // tell the source which sound to play
    this.source.connect(context.destination);       // connect the source to the context's destination (the speakers)
    //this.source.connect(this.analyzer)            //connect analyzer to our played sound
    this.source.start(0, offset, duration);
    this.sampleRate = context.sampleRate;
    this.source.buffer.getChannelData(0)
    //let channelData =buffer.getChannelData(0)
    //this.padChannelDataToSquared(channelData)
    //console.log(this.ft(buffer.getChannelData(0)))
  }
/*
  padChannelDataToSquared(channelData: Float32Array){
    var truncatedToSquare = channelData.copyWithin(0,0, 1000)
    console.log(truncatedToSquare)
  }


  getAnalyzerFrequ(){
    const bufferLength = this.analyzer!.frequencyBinCount //length of our array
    const data = new Uint8Array(bufferLength) // create new array with size equal to fftsize/2
    this.analyzer!.getByteFrequencyData(data)   // fetch the frequency data
    console.log(bufferLength, new Uint8Array(bufferLength))
    return data
  }

 */



  stopSource(){
    if(this.source??0 != 0){
      //this.getAnalyzerFrequ()
      this.source!.stop();
    }
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
