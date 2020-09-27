import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import { Chart } from 'chart.js';
import {CallApi, HTTP_COMMAND} from '../services/callApi';
import * as moment from 'moment';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {ToolsBoxService} from '../services/toolbox';

@Component({
  selector: 'app-line-chart',
  templateUrl: './lineChart.component.html',
  styleUrls: ['./lineChart.component.scss']
})
export class LineChartComponent implements OnInit  {
  data: {time: string, prod: number}[] = [];
  times: string[] = [];
  values: number[] = [];
  lineChart: Chart;

  date = new Date(moment().subtract(1, 'days').format('YYYY-MM-DD'));

  constructor(private callAPI: CallApi, private toolsBox: ToolsBoxService) {
  }

  ngOnInit() {
    this.refreshStat();
  }

  clearData = () => {
    this.data = [];
    this.times = [];
    this.values = [];
  }

  changeStartDate(event: MatDatepickerInputEvent<Date>) {
    this.date = new Date(moment(event.value, moment.defaultFormat).format('YYYY-MM-DD'));
  }

  displayChart = () => {

      this.lineChart = new Chart('canvas', {
        type: 'line',
        data: {
          labels: this.times,
          datasets: [
            {
              data: this.values,
              borderColor: '#3cba9f',
              backgroundColor: '#b8d4b4',
              fill: true
            }
          ]
        },
        options: {
          legend: {
            display: false
          },
          scales: {
            xAxes: [{
              display: true
            }],
            yAxes: [{
              display: true
            }],
          }
        }
      });
  }

  getInverterStat = (): Observable<any> => {
    const date: string = moment(this.date, moment.defaultFormat).format('YYYY-MM-DD');
    const serviceURi = '/real-time?day=' + date;
    return this.callAPI.call(HTTP_COMMAND.GET, serviceURi);
  }

  refreshStat = () => {
    this.toolsBox.refreshValues();
    this.getInverterStat().subscribe(
      (res: any) => {
        this.clearData();
        res.map(element => {
          // Format data
          const time = element.time;
          const value = element.value;
          // Store data for export
          this.data.unshift({time: time, prod: value});
          // Store data for display
          this.times.unshift(time);
          this.values.unshift(value);
        });
        this.displayChart();
      },
      (err) => {
        console.log('err', err);
      });
  }

  exportStat = () => {
    window.open('data:text/json,' + encodeURIComponent(JSON.stringify(this.data)),
      '_blank').focus();
  }
}
