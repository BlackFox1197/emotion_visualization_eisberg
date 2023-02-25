//one model output interface
export interface ModelOutputInterface{
  x1: number,
  x2: number,
  x3: number,
  x4: number,
  emotion: string,
}

//class of one modeloutput
export class ModelOutput implements ModelOutputInterface{
  x1: number;
  x2: number;
  x3: number;
  x4: number;
  emotion: string;

  constructor(parameter: ModelOutputInterface) {
    this.x1 = parameter.x1;
    this.x2 = parameter.x2;
    this.x3 = parameter.x3;
    this.x4 = parameter.x4;
    this.emotion = parameter.emotion
  }
}

export interface ModelOutputsInterface{
  sampleRate: number;
  durationInSec: number;
  outputCount: number;
  modelOutputs: ModelOutput[];
}

//class for modelOutputs, for changing or getting attributes
export class ModelOutputs implements ModelOutputsInterface{
  sampleRate: number;
  durationInSec: number;
  outputCount: number;
  modelOutputs: ModelOutput[];

  constructor(parameter: ModelOutputsInterface) {
    this.sampleRate = parameter.sampleRate;
    this.durationInSec = parameter.durationInSec;
    this.outputCount = parameter.outputCount;
    this.modelOutputs = parameter.modelOutputs ?? [];
  }
}
