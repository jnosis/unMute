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
    return isChromium
      ? chrome.storage.local.get(keys)
      : browser.storage.local.get(keys === null ? undefined : keys);
  }

  set(items: { [key: string]: any }): Promise<void> {
    return isChromium
      ? chrome.storage.local.set(items)
      : browser.storage.local.set(items);
  }
}

class SyncStorageArea implements StorageArea {
  get(
    keys: string | string[] | { [key: string]: any } | null = null
  ): Promise<{ [key: string]: any }> {
    return isChromium
      ? chrome.storage.sync.get(keys)
      : browser.storage.sync.get(keys === null ? undefined : keys);
  }

  set(items: { [key: string]: any }): Promise<void> {
    return isChromium
      ? chrome.storage.sync.set(items)
      : browser.storage.sync.set(items);
  }

  clear(): Promise<void> {
    return isChromium
      ? chrome.storage.sync.clear()
      : browser.storage.sync.clear();
  }
}

export const sync = new SyncStorageArea();
export const local = new LocalStorageArea();

export const onChanged = chrome.storage.onChanged;
