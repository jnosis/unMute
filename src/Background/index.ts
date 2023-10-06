import * as browser from '../Api/api';
import { Listener } from './listener';
import { Load } from './load';

export class Background {
  constructor() {
    browser.runtime.onStartup.addListener(() => this.onStart());
    browser.runtime.onInstalled.addListener((details) =>
      this.onInstalled(details)
    );
  }

  private onStart() {
    new Load(this.addListener);
  }

  private onInstalled(details?: browser.runtime.InstalledDetails) {
    new Load(this.addListener, details);
  }

  private addListener() {
    new Listener();
  }
}
