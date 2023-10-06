import * as browser from '../Api/api';
import { Listener } from './listener';
import { Load } from './load';

export class Background {
  constructor() {
    this.addListener();
    browser.runtime.onStartup.addListener(() => this.onStart());
    browser.runtime.onInstalled.addListener((details) =>
      this.onInstalled(details)
    );
  }

  private onStart() {
    console.log('onStart');
    new Load();
  }

  private onInstalled(details?: browser.runtime.InstalledDetails) {
    console.log('onInstalled');
    new Load(details);
  }

  private addListener() {
    new Listener();
  }
}
