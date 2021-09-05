import { browser } from '../Api/api';
import { Listener } from './listener';
import { Load } from './load';

export class Background {
  constructor() {
    browser.runtime.onStartup.addListener(onStart);
    browser.runtime.onInstalled.addListener(onInstalled);
  }
}

function onStart() {
  new Load(addListener);
}

function onInstalled(details?: browser.runtime.InstalledDetails) {
  new Load(addListener, details);
}

function addListener() {
  new Listener();
}
