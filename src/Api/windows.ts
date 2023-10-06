import { isChromium } from './platform';

export type Window = chrome.windows.Window;

export function getCurrent(): Promise<Window> {
  if (isChromium) {
    return new Promise((resolve, reject) =>
      chrome.windows.getCurrent((window) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(window);
        }
      })
    );
  }
  return browser.windows.getCurrent() as Promise<Window>;
}

export const onFocusChanged = chrome.windows.onFocusChanged;
