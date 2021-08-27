import { Listener } from './listener';
import { Load } from './load';

export class Background {
  constructor() {
    chrome.runtime.onStartup.addListener(onStart);
    chrome.runtime.onInstalled.addListener(onInstalled);
  }
}

function onStart() {
  new Load(addListener);
}

function onInstalled(details?: chrome.runtime.InstalledDetails) {
  new Load(addListener, details);
}

function addListener() {
  new Listener();
}
