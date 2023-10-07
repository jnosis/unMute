import { OptionPageMessage, OptionPageResponse } from '../types/types';
import { isChromium } from './platform';

export const id = isChromium ? chrome.runtime.id : browser.runtime.id;
export type MessageSender = chrome.runtime.MessageSender;
export type InstalledDetails =
  | chrome.runtime.InstalledDetails
  | browser.runtime._OnInstalledDetails;

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
  return isChromium
    ? chrome.runtime.sendMessage(message)
    : browser.runtime.sendMessage(message);
}

export const onStartup = isChromium
  ? chrome.runtime.onStartup
  : browser.runtime.onStartup;
export const onInstalled = isChromium
  ? chrome.runtime.onInstalled
  : browser.runtime.onInstalled;
export const onMessage = isChromium
  ? chrome.runtime.onMessage
  : (browser.runtime.onMessage as typeof chrome.runtime.onMessage);
