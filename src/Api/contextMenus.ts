import { isChromium } from './platform';

type CreateProperties = chrome.contextMenus.CreateProperties;
export type UpdateProperties = chrome.contextMenus.UpdateProperties;

export function create(createProperties: CreateProperties): string | number {
  return isChromium
    ? chrome.contextMenus.create(createProperties)
    : browser.menus.create(
        createProperties as browser.menus._CreateCreateProperties
      );
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
  return browser.menus.update(
    id,
    updateProperties as browser.menus._UpdateUpdateProperties
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
  return browser.menus.removeAll();
}

export const onClicked = chrome.contextMenus.onClicked;
