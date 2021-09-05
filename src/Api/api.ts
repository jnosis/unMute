import { OptionPageMessage, OptionPageResponse } from '../types/types';

const isChromium = true;

// Promisify chrome api
export namespace browser.tabs {
  export type Tab = chrome.tabs.Tab;
  export type TabChangeInfo = chrome.tabs.TabChangeInfo;
  export type CreateProperties = chrome.tabs.CreateProperties;
  export type UpdateProperties = chrome.tabs.UpdateProperties;
  export type QueryInfo = chrome.tabs.QueryInfo;

  export function get(tabId: number): Promise<Tab> {
    if (isChromium) {
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
    return globalThis.browser.tabs.get(tabId) as Promise<Tab>;
  }

  export function update(
    tabId: number,
    updateProperties: UpdateProperties
  ): Promise<Tab | undefined> {
    if (isChromium) {
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
    return globalThis.browser.tabs.update(tabId, updateProperties) as Promise<
      Tab | undefined
    >;
  }

  export function query(queryInfo: QueryInfo): Promise<Tab[]> {
    if (isChromium) {
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
    return globalThis.browser.tabs.query(queryInfo) as Promise<Tab[]>;
  }

  export function create(createProperties: CreateProperties): Promise<Tab> {
    if (isChromium) {
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
    return globalThis.browser.tabs.create(createProperties) as Promise<Tab>;
  }

  export const onActivated = chrome.tabs.onActivated;
  export const onUpdated = chrome.tabs.onUpdated;
  export const onRemoved = chrome.tabs.onRemoved;
}

export namespace browser.windows {
  export type Window = chrome.windows.Window;

  export function getCurrent(): Promise<Window> {
    if (isChromium) {
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
    return globalThis.browser.windows.getCurrent() as Promise<Window>;
  }

  export const onFocusChanged = chrome.windows.onFocusChanged;
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
      if (keys === null) return globalThis.browser.storage.local.get();
      return globalThis.browser.storage.local.get(keys);
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
      return globalThis.browser.storage.local.set(items);
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
      return globalThis.browser.storage.sync.get(keys);
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
      return globalThis.browser.storage.sync.set(items);
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
      return globalThis.browser.storage.sync.clear();
    }
  }

  export const sync = new SyncStorageArea();
  export const local = new LocalStorageArea();

  export const onChanged = chrome.storage.onChanged;
}

export namespace browser.action {
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
    return globalThis.browser.browserAction
      .setBadgeText(
        details as globalThis.browser.browserAction._SetBadgeTextDetails
      )
      .then(() =>
        globalThis.browser.browserAction.setBadgeTextColor({ color: 'white' })
      );
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
    return globalThis.browser.browserAction.setBadgeBackgroundColor(details);
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
    return globalThis.browser.browserAction.enable(tabId);
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
    return globalThis.browser.browserAction.disable(tabId);
  }

  export const onClicked = chrome.browserAction.onClicked;
}

export namespace browser.commands {
  export const onCommand = chrome.commands.onCommand;
}

export namespace browser.contextMenus {
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
        globalThis.browser.contextMenus.create(
          createProperties as globalThis.browser.contextMenus._CreateCreateProperties,
          () => {
            if (globalThis.browser.runtime.lastError) {
              reject(globalThis.browser.runtime.lastError);
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
    return globalThis.browser.contextMenus.update(
      id,
      updateProperties as globalThis.browser.contextMenus._UpdateUpdateProperties
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
    return globalThis.browser.contextMenus.removeAll();
  }

  export const onClicked = chrome.contextMenus.onClicked;
}

export namespace browser.notifications {
  export type NotificationOptions = chrome.notifications.NotificationOptions;

  export function create(
    notificationId: string,
    options: NotificationOptions
  ): Promise<string> {
    if (isChromium) {
      return new Promise((resolve, reject) =>
        chrome.notifications.create(
          notificationId,
          options,
          (notificationId) => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);
            } else {
              resolve(notificationId);
            }
          }
        )
      );
    }
    return globalThis.browser.notifications.create(
      notificationId,
      options as globalThis.browser.notifications.CreateNotificationOptions
    );
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
    return globalThis.browser.notifications.clear(notificationId);
  }

  export const onClicked = chrome.notifications.onClicked;
}

export namespace browser.i18n {
  export function getMessage(messageName: string, substitutions?: any) {
    return isChromium
      ? chrome.i18n.getMessage(messageName, substitutions)
      : globalThis.browser.i18n.getMessage(messageName, substitutions);
  }
}

export namespace browser.runtime {
  export const id = chrome.runtime.id;
  export type MessageSender = chrome.runtime.MessageSender;
  export type InstalledDetails = chrome.runtime.InstalledDetails;

  export function getManifest() {
    return isChromium
      ? chrome.runtime.getManifest()
      : globalThis.browser.runtime.getManifest();
  }

  export function getURL(path: string) {
    return isChromium
      ? chrome.runtime.getURL(path)
      : globalThis.browser.runtime.getURL(path);
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
    return globalThis.browser.runtime.sendMessage(message);
  }

  export const onStartup = chrome.runtime.onStartup;
  export const onInstalled = chrome.runtime.onInstalled;
  export const onMessage = chrome.runtime.onMessage;
}
