import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import { Chart } from 'chart.js';
import {CallApi, HTTP_COMMAND} from '../services/callApi';
import * as moment from 'moment';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {ToolsBoxService} from '../services/toolbox';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './barChart.component.html',
  styleUrls: ['./barChart.component.scss']
})
export class BarChartComponent implements OnInit  {
  data: {date: string, prod: number}[] = [];
  timestamps: string[] = [];
  values: number[] = [];
  barchart: Chart;

  startDate = new Date(moment().startOf('month').format('YYYY-MM-DD hh:mm'));
  endDate = new Date(moment().endOf('month').format('YYYY-MM-DD hh:mm'));


  constructor(private callAPI: CallApi, private toolsBox: ToolsBoxService) {
  }

  ngOnInit() {
    this.refreshStat();
  }

  clearData = () => {
    this.data = [];
    this.timestamps = [];
    this.values = [];
  }

  changeStartDate(type: string, event: MatDatepickerInputEvent<Date>) {
    const newDate = new Date(moment(event.value, moment.defaultFormat).format('YYYY-MM-DD hh:mm'));
    switch (type) {
      case 'start':
        this.startDate = newDate;
        break;
      case 'end':
        this.endDate = newDate;
        break;
      default:
        break;
    }
  }

  displayChart = () => {

      this.barchart = new Chart('canvas', {
        type: 'bar',
        data: {
          labels: this.timestamps,
          datasets: [
            {
              data: this.values,
              borderColor: '#3cba9f',
              backgroundColor: '#3cba9f',
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
    const startDate: string = moment(this.startDate, moment.defaultFormat).format('YYYY-MM-DD');
    const endDate: string = moment(this.endDate, moment.defaultFormat).format('YYYY-MM-DD');
    const serviceURi = '/daily-prod' +
      '?start=' + startDate +
      '&end=' + endDate;
    return this.callAPI.call(HTTP_COMMAND.GET, serviceURi);
  }

  refreshStat = () => {
    this.toolsBox.refreshValues();
    this.getInverterStat().subscribe(
      (res: any) => {
        this.clearData();
        const receivedData: [any] = res;
        receivedData.map(element => {
          // Format data
          const date = element.date;
          const value = element.value;
          // Store data for export
          this.data.unshift({date: date, prod: value});
          // Store data for display
          this.timestamps.unshift(date);
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
