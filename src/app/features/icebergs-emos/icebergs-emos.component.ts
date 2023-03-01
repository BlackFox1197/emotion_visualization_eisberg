import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
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

  //jsonNames = ["angrypca.json","disgustpca.json", "fearpca.json", "happypca.json", "neutralpca.json", "sadpca.json", "surprisepca.json"]
  jsonNames = ["angry_tess.json","disgust_tess.json", "fear_tess.json", "happy_tess.json", "neutral_tess.json", "sad_tess.json", "surprise_tess.json"]

  public emosArray: Array<any> =[];
  isLoadin = true;

  constructor(private es: EisbergService, private backend: BackendService, private changeDetector : ChangeDetectorRef) { }

  _showBarCharts = false;

  set showBarCharts(il: boolean) {
    this._showBarCharts = il;
    this.changeDetector.detectChanges();
  }

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
