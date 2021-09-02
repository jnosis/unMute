import { OptionPageMessage, OptionPageResponse } from '../types/types';

// Promisify chrome api
export namespace browser.tabs {
  export type Tab = chrome.tabs.Tab;
  export type TabChangeInfo = chrome.tabs.TabChangeInfo;
  export type CreateProperties = chrome.tabs.CreateProperties;
  export type UpdateProperties = chrome.tabs.UpdateProperties;
  export type QueryInfo = chrome.tabs.QueryInfo;

  export function get(tabId: number): Promise<Tab> {
    return new Promise((resolve) => chrome.tabs.get(tabId, resolve));
  }

  export function update(
    tabId: number,
    updateProperties: UpdateProperties
  ): Promise<Tab | undefined> {
    return new Promise((resolve) =>
      chrome.tabs.update(tabId, updateProperties, resolve)
    );
  }

  export function query(queryInfo: QueryInfo): Promise<Tab[]> {
    return new Promise((resolve) => chrome.tabs.query(queryInfo, resolve));
  }

  export function create(createProperties: CreateProperties): Promise<Tab> {
    return new Promise((resolve) =>
      chrome.tabs.create(createProperties, resolve)
    );
  }
}

export namespace browser.windows {
  export type Window = chrome.windows.Window;

  export function getCurrent(): Promise<Window> {
    return new Promise((resolve) => chrome.windows.getCurrent(resolve));
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
      return new Promise((resolve) => chrome.storage.local.get(keys, resolve));
    }

    set(items: { [key: string]: any }): Promise<void> {
      return new Promise((resolve) => chrome.storage.local.set(items, resolve));
    }
  }

  class SyncStorageArea implements StorageArea {
    get(
      keys: string | string[] | { [key: string]: any } | null = null
    ): Promise<{ [key: string]: any }> {
      return new Promise((resolve) => chrome.storage.sync.get(keys, resolve));
    }

    set(items: { [key: string]: any }): Promise<void> {
      return new Promise((resolve) => chrome.storage.sync.set(items, resolve));
    }

    clear(): Promise<void> {
      return new Promise((resolve) => chrome.storage.sync.clear(resolve));
    }
  }

  export const sync = new SyncStorageArea();
  export const local = new LocalStorageArea();
}

export namespace browser.action {
  export function setBadgeText(
    details: chrome.browserAction.BadgeTextDetails
  ): Promise<void> {
    return new Promise((resolve) =>
      chrome.browserAction.setBadgeText(details, resolve)
    );
  }

  export function setBadgeBackgroundColor(
    details: chrome.browserAction.BadgeBackgroundColorDetails
  ): Promise<void> {
    return new Promise((resolve) =>
      chrome.browserAction.setBadgeBackgroundColor(details, resolve)
    );
  }

  export function enable(tabId?: number): Promise<void> {
    return new Promise((resolve) =>
      chrome.browserAction.enable(tabId, resolve)
    );
  }

  export function disable(tabId?: number): Promise<void> {
    return new Promise((resolve) =>
      chrome.browserAction.disable(tabId, resolve)
    );
  }
}

export namespace browser.contextMenus {
  export type UpdateProperties = chrome.contextMenus.UpdateProperties;

  export function create(
    createProperties: chrome.contextMenus.CreateProperties
  ): Promise<void> {
    return new Promise((resolve) =>
      chrome.contextMenus.create(createProperties, resolve)
    );
  }

  export function update(
    id: string,
    updateProperties: chrome.contextMenus.UpdateProperties
  ): Promise<void> {
    return new Promise((resolve) =>
      chrome.contextMenus.update(id, updateProperties, resolve)
    );
  }

  export function removeAll(): Promise<void> {
    return new Promise((resolve) => chrome.contextMenus.removeAll(resolve));
  }
}

export namespace browser.notifications {
  export type NotificationOptions = chrome.notifications.NotificationOptions;

  export function create(
    notificationId: string,
    options: NotificationOptions
  ): Promise<string> {
    return new Promise((resolve) =>
      chrome.notifications.create(notificationId, options, resolve)
    );
  }

  export function clear(notificationId: string): Promise<boolean> {
    return new Promise((resolve) =>
      chrome.notifications.clear(notificationId, resolve)
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
    return new Promise((resolve) =>
      chrome.runtime.sendMessage(message, resolve)
    );
  }
}
