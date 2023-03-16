import {Component, Input, OnInit} from '@angular/core';
import {ChartConfiguration} from "chart.js/dist/types";
import {ModelOutput} from "../../../entity/ModelOutput";

@Component({
  selector: 'app-emo-chart',
  templateUrl: './emo-chart.component.html',
  styleUrls: ['./emo-chart.component.scss']
})
export class EmoChartComponent implements OnInit {

  @Input() parameterArray?: ModelOutput;
  @Input() name?: string;
  @Input() barChart: boolean = true;


  constructor() { }

  ngOnInit(): void {
  }



  public barChartLegend = false;
  public barChartPlugins = [];


  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: false,
    borderColor: "white",
    scales:{
      y:{
        min: -1,
        max: 1,
      }
    }
  };

  public radarChartOptions: ChartConfiguration<'radar'>['options'] = {
    responsive: false,
    borderColor: "white",
    scales:{
      r:{
        min: -1,
        max: 1,
        ticks:{
          display: false
        }
      }
    }
  };
}
