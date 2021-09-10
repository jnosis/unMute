import { isChromium } from './platform';

export type StorageChange = chrome.storage.StorageChange;

interface StorageArea {
  get(
    keys: string | string[] | { [key: string]: any } | null
  ): Promise<{ [key: string]: any }>;
  set(items: { [key: string]: any }): Promise<void>;
}

class LocalStorageArea implements StorageArea {
  get(
    keys: string | string[] | { [key: string]: any } | null = null
  ): Promise<{ [key: string]: any }> {
    if (isChromium) {
      return new Promise((resolve, reject) =>
        chrome.storage.local.get(keys, (items) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(items);
          }
        })
      );
    }
    if (keys === null) return browser.storage.local.get();
    return browser.storage.local.get(keys);
  }

  set(items: { [key: string]: any }): Promise<void> {
    if (isChromium) {
      return new Promise((resolve, reject) =>
        chrome.storage.local.set(items, () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve();
          }
        })
      );
    }
    return browser.storage.local.set(items);
  }
}

class SyncStorageArea implements StorageArea {
  get(
    keys: string | string[] | { [key: string]: any } | null = null
  ): Promise<{ [key: string]: any }> {
    if (isChromium) {
      return new Promise((resolve, reject) =>
        chrome.storage.sync.get(keys, (items) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(items);
          }
        })
      );
    }
    if (keys === null) return globalThis.browser.storage.sync.get();
    return browser.storage.sync.get(keys);
  }

  set(items: { [key: string]: any }): Promise<void> {
    if (isChromium) {
      return new Promise((resolve, reject) =>
        chrome.storage.sync.set(items, () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve();
          }
        })
      );
    }
    return browser.storage.sync.set(items);
  }

  clear(): Promise<void> {
    if (isChromium) {
      return new Promise((resolve, reject) =>
        chrome.storage.sync.clear(() => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve();
          }
        })
      );
    }
    return browser.storage.sync.clear();
  }
}

export const sync = new SyncStorageArea();
export const local = new LocalStorageArea();

export const onChanged = chrome.storage.onChanged;
