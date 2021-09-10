import { OptionPageMessage, OptionPageResponse } from '../types/types';
import { isChromium } from './platform';

export const id = chrome.runtime.id;
export type MessageSender = chrome.runtime.MessageSender;
export type InstalledDetails = chrome.runtime.InstalledDetails;

export function getManifest() {
  return isChromium
    ? chrome.runtime.getManifest()
    : browser.runtime.getManifest();
}

export function getURL(path: string) {
  return isChromium
    ? chrome.runtime.getURL(path)
    : browser.runtime.getURL(path);
}

export function sendMessage(
  message: OptionPageMessage
): Promise<OptionPageResponse> {
  if (isChromium) {
    return new Promise((resolve, reject) =>
      chrome.runtime.sendMessage(message, (response) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(response);
        }
      })
    );
  }
  return browser.runtime.sendMessage(message);
}

export const onStartup = chrome.runtime.onStartup;
export const onInstalled = chrome.runtime.onInstalled;
export const onMessage = chrome.runtime.onMessage;
