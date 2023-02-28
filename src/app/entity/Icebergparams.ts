export interface IcebergParams {
  skew?: number;
  colorParam?: number;
  borderParam?: number;
  height?: number;
  frequency?: number;
  label?: string;
}


export class IcebergParamsClass implements IcebergParams{
  skew?: number;
  colorParam?: number;
  borderParam?: number;
  height?: number;
  frequency?: number;
  label?: string;

  constructor(parameter: IcebergParams) {
    this.skew = parameter.skew;
    this.colorParam = parameter.colorParam;
    this.borderParam = parameter.borderParam;
    this.height = parameter.height;
    this.frequency = parameter.frequency;
    this.label = parameter.label;
  }

  morphTo(){

  }
}
