import { isChromium } from './platform';

type CreateProperties = chrome.contextMenus.CreateProperties;
export type UpdateProperties = chrome.contextMenus.UpdateProperties;

export function create(createProperties: CreateProperties): Promise<void> {
  return new Promise((resolve, reject) => {
    if (isChromium) {
      chrome.contextMenus.create(createProperties, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    } else {
      browser.contextMenus.create(
        createProperties as browser.contextMenus._CreateCreateProperties,
        () => {
          if (browser.runtime.lastError) {
            reject(browser.runtime.lastError);
          } else {
            resolve();
          }
        }
      );
    }
  });
}

export function update(
  id: string,
  updateProperties: UpdateProperties
): Promise<void> {
  if (isChromium) {
    return new Promise((resolve, reject) =>
      chrome.contextMenus.update(id, updateProperties, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      })
    );
  }
  return browser.contextMenus.update(
    id,
    updateProperties as browser.contextMenus._UpdateUpdateProperties
  );
}

export function removeAll(): Promise<void> {
  if (isChromium) {
    return new Promise((resolve, reject) =>
      chrome.contextMenus.removeAll(() => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      })
    );
  }
  return browser.contextMenus.removeAll();
}

export const onClicked = chrome.contextMenus.onClicked;
