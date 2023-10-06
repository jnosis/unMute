import { isChromium } from './platform';

type BadgeTextDetails = chrome.browserAction.BadgeTextDetails;
type BadgeColorDetails = chrome.browserAction.BadgeBackgroundColorDetails;

export function setBadgeText(details: BadgeTextDetails): Promise<void> {
  if (isChromium) {
    return new Promise((resolve, reject) =>
      chrome.browserAction.setBadgeText(details, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      })
    );
  }
  return browser.browserAction
    .setBadgeText(details as browser.browserAction._SetBadgeTextDetails)
    .then(() => browser.browserAction.setBadgeTextColor({ color: 'white' }));
}

export function setBadgeBackgroundColor(
  details: BadgeColorDetails
): Promise<void> {
  if (isChromium) {
    return new Promise((resolve, reject) =>
      chrome.browserAction.setBadgeBackgroundColor(details, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      })
    );
  }
  return browser.browserAction.setBadgeBackgroundColor(details);
}

export function enable(tabId?: number): Promise<void> {
  if (isChromium) {
    return new Promise((resolve, reject) =>
      chrome.browserAction.enable(tabId, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      })
    );
  }
  return browser.browserAction.enable(tabId);
}

export function disable(tabId?: number): Promise<void> {
  if (isChromium) {
    return new Promise((resolve, reject) =>
      chrome.browserAction.disable(tabId, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      })
    );
  }
  return browser.browserAction.disable(tabId);
}

export const onClicked = chrome.browserAction.onClicked;
