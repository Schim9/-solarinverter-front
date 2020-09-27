import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {CallApi, HTTP_COMMAND} from './services/callApi';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  barChart = true;
}
