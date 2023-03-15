import { Injectable } from '@angular/core';
import {forkJoin, Observable} from "rxjs";
import {ModelOutput, ModelOutputs} from "../../entity/ModelOutput";
import {HttpClient, HttpHeaders} from "@angular/common/http";
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
  modelOutput: ModelOutput | undefined
  routes: Routes;
  jsonArray: any;

  isLoadin = true;

  constructor(private http: HttpClient) {
    this.routes = new Routes();
  }

  /**
   * File upload method, as its different from the post method, because we want events (e.g. for tracking the progress)
   * furthermore the headers are different, as its not json
   */
  public uploadAudioFile(path: string, formdataName: string, reportProgress: boolean = false, file: File){
    const formdata = new FormData();
    const headersCors = new HttpHeaders().set('content-type', 'multipart/form-data')
      .set('Access-Control-Allow-Origin', '*')
    formdata.append(formdataName, file)

    return new Observable<any>( subscriber =>
      this.http.post(path, formdata).subscribe(
        (response)=>{
          subscriber.next(response)
        }))

    /*return this.http.post<UploadFile>(path, formdata,{
      reportProgress,
      observe: 'response',
      //headers: headersCors
      //headers???
    }).subscribe((res)=>console.log(res))

     */
  }

  public test(path:string){
    this.http.post(path, "").subscribe({
      next(num){console.log(num)}
      }
    )
  }


  //http request
  public getModelOutputsHttp(){
    return this.http.get<ModelOutputs>(Routes.modelOutputsRoute)
  }

  public getModelOutputForSelected (startInSec: number, stopInSec: number, durationInSec: number, fileName:string){
    return new Observable<any>(subscriber =>
      this.http.get(Routes.modelOutputsRoute+"/"+startInSec+"/"+stopInSec+"/"+durationInSec+"/"+fileName).subscribe((response)=>
      subscriber.next(response)))
    /*return this.http.get<ModelOutput>(this.routes.modelOutputsRoute+"/"+startInSec+"/"+stopInSec+"/"+durationInSec)
      .subscribe((next) => {
        this.modelOutput = next;
        this.isLoadin = false;
      }
    )

     */
    //return this.modelOutputs
  }

  //get the modeloutputs
  public getModelOutputs(): ModelOutputs{
    this.getModelOutputsHttp().subscribe((data: ModelOutputs)=> this.modelOutputs={
      sampleRate: data.sampleRate,
      durationInSec: data.durationInSec,
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

  public loadIcebergsFor7Emos(filename: string): Observable<any>{
    return new Observable<any>(subscriber =>
    this.http.get('./assets/sevenemos/emo_pca_tess/'+filename).subscribe(
      (response) => {
        subscriber.next(response)
      }))
  }

  public load7Emos(filenames: string[]){
    let observables = []
    for(let i=0; i< filenames.length; i++) {
      observables.push(this.http.get('./assets/sevenemos/emos_3/'+filenames[i]))
    }
    return forkJoin(observables)
  }
}
