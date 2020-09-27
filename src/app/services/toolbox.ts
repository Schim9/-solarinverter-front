import {EventEmitter, Injectable, Output} from '@angular/core';

@Injectable()
export class ToolsBoxService {
  @Output() fireRefreshValue: EventEmitter<any> = new EventEmitter();

  // Will emit an event in order to trigger data update
  refreshValues = () => {
    this.fireRefreshValue.emit();
  }

  getEmittedValue = (): EventEmitter<any> => {
    return this.fireRefreshValue;
  }
}
