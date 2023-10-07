import { isChromium } from './platform';

export type NotificationOptions =
  chrome.notifications.NotificationOptions<true>;

export function create(
  notificationId: string,
  options: NotificationOptions
): Promise<string> {
  if (isChromium) {
    return new Promise((resolve, reject) =>
      chrome.notifications.create(notificationId, options, (notificationId) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(notificationId);
        }
      })
    );
  }
  return browser.notifications.create(notificationId, options);
}

export function clear(notificationId: string): Promise<boolean> {
  if (isChromium) {
    return new Promise((resolve, reject) =>
      chrome.notifications.clear(notificationId, (wasCleared) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(wasCleared);
        }
      })
    );
  }
  return browser.notifications.clear(notificationId);
}

export const onClicked = isChromium
  ? chrome.notifications.onClicked
  : browser.notifications.onClicked;
