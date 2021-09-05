import { OptionPageMessage, OptionPageResponse } from '../types/types';

// Promisify chrome api
export namespace browser.tabs {
  export type Tab = chrome.tabs.Tab;
  export type TabChangeInfo = chrome.tabs.TabChangeInfo;
  export type CreateProperties = chrome.tabs.CreateProperties;
  export type UpdateProperties = chrome.tabs.UpdateProperties;
  export type QueryInfo = chrome.tabs.QueryInfo;

  export function get(tabId: number): Promise<Tab> {
    return new Promise((resolve, reject) =>
      chrome.tabs.get(tabId, (tab) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(tab);
        }
      })
    );
  }

  export function update(
    tabId: number,
    updateProperties: UpdateProperties
  ): Promise<Tab | undefined> {
    return new Promise((resolve, reject) =>
      chrome.tabs.update(tabId, updateProperties, (tab) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(tab);
        }
      })
    );
  }

  export function query(queryInfo: QueryInfo): Promise<Tab[]> {
    return new Promise((resolve, reject) =>
      chrome.tabs.query(queryInfo, (tabs) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(tabs);
        }
      })
    );
  }

  export function create(createProperties: CreateProperties): Promise<Tab> {
    return new Promise((resolve, reject) =>
      chrome.tabs.create(createProperties, (tab) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(tab);
        }
      })
    );
  }
}

export namespace browser.windows {
  export type Window = chrome.windows.Window;

  export function getCurrent(): Promise<Window> {
    return new Promise((resolve, reject) =>
      chrome.windows.getCurrent((window) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(window);
        }
      })
    );
  }
}

export namespace browser.storage {
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

    set(items: { [key: string]: any }): Promise<void> {
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
  }

  class SyncStorageArea implements StorageArea {
    get(
      keys: string | string[] | { [key: string]: any } | null = null
    ): Promise<{ [key: string]: any }> {
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

    set(items: { [key: string]: any }): Promise<void> {
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

    clear(): Promise<void> {
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
  }

  export const sync = new SyncStorageArea();
  export const local = new LocalStorageArea();
}

export namespace browser.action {
  type BadgeTextDetails = chrome.browserAction.BadgeTextDetails;
  type BadgeColorDetails = chrome.browserAction.BadgeBackgroundColorDetails;

  export function setBadgeText(details: BadgeTextDetails): Promise<void> {
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

  export function setBadgeBackgroundColor(
    details: BadgeColorDetails
  ): Promise<void> {
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

  export function enable(tabId?: number): Promise<void> {
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

  export function disable(tabId?: number): Promise<void> {
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
}

export namespace browser.contextMenus {
  type CreateProperties = chrome.contextMenus.CreateProperties;
  export type UpdateProperties = chrome.contextMenus.UpdateProperties;

  export function create(createProperties: CreateProperties): Promise<void> {
    return new Promise((resolve, reject) =>
      chrome.contextMenus.create(createProperties, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      })
    );
  }

  export function update(
    id: string,
    updateProperties: UpdateProperties
  ): Promise<void> {
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

  export function removeAll(): Promise<void> {
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
}

export namespace browser.notifications {
  export type NotificationOptions = chrome.notifications.NotificationOptions;

  export function create(
    notificationId: string,
    options: NotificationOptions
  ): Promise<string> {
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

  export function clear(notificationId: string): Promise<boolean> {
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
}

export namespace browser.i18n {
  export function getMessage(messageName: string, substitutions?: any) {
    return chrome.i18n.getMessage(messageName, substitutions);
  }
}

export namespace browser.runtime {
  export const id = chrome.runtime.id;
  export type MessageSender = chrome.runtime.MessageSender;
  export type InstalledDetails = chrome.runtime.InstalledDetails;

  export function getManifest() {
    return chrome.runtime.getManifest();
  }

  export function getURL(path: string) {
    return chrome.runtime.getURL(path);
  }

  export function sendMessage(
    message: OptionPageMessage
  ): Promise<OptionPageResponse> {
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
}
