import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Chart} from 'chart.js';
import {CallApi, HTTP_COMMAND} from '../services/callApi';
import * as moment from 'moment';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {ToolsBoxService} from '../services/toolbox';

@Component({
  selector: 'app-live-stat',
  templateUrl: './liveStat.component.html',
  styleUrls: ['./liveStat.component.scss']
})
export class LiveStatComponent implements OnInit {

  currentDate: string;
  runtimeProd: number;
  weekProd: number;
  monthProd: number;
  yearProd: number;

  constructor(private callAPI: CallApi, private toolsBox: ToolsBoxService) {
  }

  ngOnInit() {
    this.getInverterStat();
    this.toolsBox.getEmittedValue().subscribe(event => this.getInverterStat());
  }

  getInverterStat = () => {
    const serviceURi = '/livedata/';
    this.callAPI.call(HTTP_COMMAND.GET, serviceURi).subscribe(
      (element: any) => {
          // Format data
          this.currentDate = element.date;
          this.runtimeProd = element.dayProd;
          this.weekProd = element.weekProd;
          this.monthProd = element.monthProd;
          this.yearProd = element.yearProd;
      },
      (err) => {
        console.log('err', err);
      });
  }
}
