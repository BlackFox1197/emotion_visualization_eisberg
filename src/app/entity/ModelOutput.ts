//one model output interface
export interface ModelOutputInterface{
  x1: number,
  x2: number,
  x3: number,
  x4: number,
}

//class of one modeloutput
export class ModelOutput implements ModelOutputInterface{
  x1: number;
  x2: number;
  x3: number;
  x4: number;

  constructor(parameter: ModelOutputInterface) {
    this.x1 = parameter.x1;
    this.x2 = parameter.x2;
    this.x3 = parameter.x3;
    this.x4 = parameter.x4;
  }
}

export interface ModelOutputsInterface{
  sampleRate: number;
  durationInSec: number;
  startInSec: number;
  outputCount: number;
  modelOutputs: ModelOutput[];
}

//class for modelOutputs, for changing or getting attributes
export class ModelOutputs implements ModelOutputsInterface{
  sampleRate: number;
  durationInSec: number;
  startInSec: number;
  outputCount: number;
  modelOutputs: ModelOutput[];

  constructor(parameter: ModelOutputsInterface) {
    this.sampleRate = parameter.sampleRate;
    this.durationInSec = parameter.durationInSec;
    this.startInSec = parameter.startInSec;
    this.outputCount = parameter.outputCount;
    this.modelOutputs = parameter.modelOutputs ?? [];
  }
}
