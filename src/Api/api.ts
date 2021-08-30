// Promisify chrome api
export namespace Api.tabs {
  export function get(tabId: number): Promise<chrome.tabs.Tab> {
    return new Promise((resolve) => chrome.tabs.get(tabId, resolve));
  }

  export function update(
    tabId: number,
    updateProperties: chrome.tabs.UpdateProperties
  ): Promise<chrome.tabs.Tab | undefined> {
    return new Promise((resolve) =>
      chrome.tabs.update(tabId, updateProperties, resolve)
    );
  }

  export function query(
    queryInfo: chrome.tabs.QueryInfo
  ): Promise<chrome.tabs.Tab[]> {
    return new Promise((resolve) => chrome.tabs.query(queryInfo, resolve));
  }
}

export namespace Api.windows {
  export function getCurrent(): Promise<chrome.windows.Window> {
    return new Promise((resolve) => chrome.windows.getCurrent(resolve));
  }
}

export namespace Api.storage {
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

export namespace Api.action {
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

export namespace Api.contextMenus {
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

export namespace Api.notifications {
  export function create(
    notificationId: string,
    options: chrome.notifications.NotificationOptions
  ): Promise<string> {
    return new Promise((resolve) =>
      chrome.notifications.create(notificationId, options, resolve)
    );
  }
}
