import { isChromium } from './platform';

export type Window = chrome.windows.Window;

export function getCurrent(): Promise<Window> {
  return isChromium
    ? chrome.windows.getCurrent()
    : (browser.windows.getCurrent() as Promise<Window>);
}

export const onFocusChanged = isChromium
  ? chrome.windows.onFocusChanged
  : browser.windows.onFocusChanged;
