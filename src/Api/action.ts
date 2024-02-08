import { isChromium } from './platform';

type BadgeTextDetails = chrome.action.BadgeTextDetails;
type BadgeColorDetails = chrome.action.BadgeColorDetails;

export function setBadgeText(details: BadgeTextDetails): Promise<void> {
  return isChromium
    ? chrome.action.setBadgeText(details)
    : browser.action
        .setBadgeText(details)
        .then(() => browser.action.setBadgeTextColor({ color: 'white' }));
}

export function setBadgeBackgroundColor(
  details: BadgeColorDetails
): Promise<void> {
  return isChromium
    ? chrome.action.setBadgeBackgroundColor(details)
    : browser.action.setBadgeBackgroundColor(details);
}

export function enable(tabId?: number): Promise<void> {
  return isChromium
    ? chrome.action.enable(tabId)
    : browser.action.enable(tabId);
}

export function disable(tabId?: number): Promise<void> {
  return isChromium
    ? chrome.action.disable(tabId)
    : browser.action.disable(tabId);
}

export const onClicked = isChromium
  ? chrome.action.onClicked
  : browser.action.onClicked;
