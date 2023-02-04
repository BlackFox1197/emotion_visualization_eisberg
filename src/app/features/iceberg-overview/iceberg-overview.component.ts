import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CCCOutputToMorph} from "../iceberg-manual-preview/canvasjs-cancer/canvasjs-cancer.component";
import {delay} from "rxjs";

@Component({
  selector: 'app-iceberg-overview',
  templateUrl: './iceberg-overview.component.html',
  styleUrls: ['./iceberg-overview.component.scss']
})
export class IcebergOverviewComponent implements OnInit {

  @Input() jsonArray: any;
  @Output() onLoadedD: EventEmitter<Array<any>> = new EventEmitter<Array<any>>();

  constructor() { }

  ngOnInit(): void {
    console.log(this.jsonArray)
  }

  ngAfterViewInit(): void {
    console.log(this.jsonArray)
  }

  onLoadedData($event: any){

  }

}
