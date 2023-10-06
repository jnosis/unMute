import { isChromium } from './platform';

export function getMessage(messageName: string, substitutions?: any) {
  return isChromium
    ? chrome.i18n.getMessage(messageName, substitutions)
    : browser.i18n.getMessage(messageName, substitutions);
}
