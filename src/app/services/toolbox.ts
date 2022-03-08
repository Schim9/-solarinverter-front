import {EventEmitter, Injectable, Output} from '@angular/core';

@Injectable()
export class ToolsBoxService {
  @Output() fireRefresh: EventEmitter<any> = new EventEmitter();
  @Output() fireReceiveUpdatedValue: EventEmitter<number> = new EventEmitter();

  // Will emit an event in order to trigger data update
  getRefreshTrigger = (): EventEmitter<any> => {
    return this.fireRefresh;
  }

  // Will emit an event in order to notify a data update
  getReceiveUpdateTrigger = (): EventEmitter<number> => {
    return this.fireReceiveUpdatedValue;
  }
}
