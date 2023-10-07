import { isChromium } from './platform';

export const onCommand = isChromium
  ? chrome.commands.onCommand
  : (browser.commands.onCommand as typeof chrome.commands.onCommand);
