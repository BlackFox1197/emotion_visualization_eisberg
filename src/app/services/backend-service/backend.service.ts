import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {ModelOutput, ModelOutputs} from "../../entity/ModelOutput";
import {HttpClient} from "@angular/common/http";
import {Routes} from "../routes";

export interface UploadFile {
  id: string;
  filename: string;
  type?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  modelOutputs: ModelOutputs | undefined
  routes: Routes;
  jsonArray: any;

  constructor(private http: HttpClient) {
    this.routes = new Routes();
  }

  /**
   * File upload method, as its different from the post method, because we want events (e.g. for tracking the progress)
   * furthermore the headers are different, as its not json
   */
  public uploadAudioFile(path: string,formdataName: string, reportProgress: boolean = false, file: File){
    const formdata = new FormData();
    formdata.append(formdataName, file)

    return this.http.post<UploadFile>(path, formdata,{
      reportProgress,
      observe: 'response',
      //headers???
    })
  }

  //http request
  public getModelOutputsHttp(){
    return this.http.get<ModelOutputs>(this.routes.modelOutputsRoute)
  }

  //get the modeloutputs
  public getModelOutputs(): ModelOutputs{
    this.getModelOutputsHttp().subscribe((data: ModelOutputs)=> this.modelOutputs={
      sampleRate: data.sampleRate,
      durationInSec: data.durationInSec,
      startInSec: data.startInSec,
      outputCount: data.outputCount,
      modelOutputs: data.modelOutputs,
    })
    return <ModelOutputs>this.modelOutputs;
  }

  //load our debug json
  public loadAssetsJson(): Observable<any>{

    return new Observable<any>( subscriber =>
      this.http.get('./assets/modelOutputs.json').subscribe(
        (response)=>{
              subscriber.next(response)
        }))
  }
}
