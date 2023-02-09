import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BackendService} from "../../services/backend-service/backend.service";
import Two from "two.js";
import {ModelOutput} from "../../entity/ModelOutput";
import {IcebergParams} from "../../entity/Icebergparams";
import {IceBergConfig} from "../../entity/IceBergConfig";
import {Color} from "../../entity/Color";
import {EisbergService} from "../../services/vis-services/eisberg.service";
import {isEmpty} from "rxjs";

@Component({
  selector: 'app-icebergs-emos',
  templateUrl: './icebergs-emos.component.html',
  styleUrls: ['./icebergs-emos.component.scss']
})
export class IcebergsEmosComponent implements OnInit {
  @ViewChild('icebergsEmos') myDiv?: ElementRef;

  jsonNames = ["angry.json","disgust.json", "fear.json", "happy.json", "neutral.json", "sad.json", "surprise.json"]

  public emosArray: Array<any> =[];
  isLoadin = true;

  constructor(private es: EisbergService, private backend: BackendService) { }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void{
    for(let i=0; i< this.jsonNames.length; i++){
      this.backend.loadIcebergsFor7Emos(this.jsonNames[i]).subscribe(
        (next) => {
          this.emosArray.push(next)
          if(i==this.jsonNames.length-1){
            this.emosArray= this.es.genIceConfs(this.emosArray);
            this.isLoadin = false
          }
        }
      )
    }
  }

}
